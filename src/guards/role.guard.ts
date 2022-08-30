import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {Request } from 'express'
import { AuthService } from 'src/services/auth/auth.service';
import { UserRole } from 'src/models/user/user';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService:AuthService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:Request = context.switchToHttp().getRequest();
    return this.verify(request,context)
  }

  async verify(request:Request,context: ExecutionContext):Promise<boolean>{
    const role:unknown = this.reflector.get<string[]>('userRoles',context.getHandler());
    const userRoles:UserRole[] = role as UserRole[];
    const token:string = request.headers.authorization;
    let currentUser = await this.authService.verify(token);
    
    //check if user is verified
    if(!currentUser){
      return false;
    }

    //check if user has record
    if(!currentUser.info){
      return false;
    }

    //check if the role exist
    if(userRoles.findIndex((requiredRole)=>{
      return currentUser.info.roles.findIndex((currentRole)=>currentRole == requiredRole) != -1;
    }) == -1){
      return false;
    }

    //all condition fulfilled, return true;
    request.currentUser = currentUser;
    return true;
  }
}
