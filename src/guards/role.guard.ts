import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private authService:AuthService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:Request = context.switchToHttp().getRequest();
    return this.verify(request);
  }


  async verify(request:Request):Promise<boolean>{
    const token:string = request.headers.authorization;
    let currentUser = await this.authService.verify(token);
    request.currentUser = currentUser;
    return currentUser!=undefined;
  }
}