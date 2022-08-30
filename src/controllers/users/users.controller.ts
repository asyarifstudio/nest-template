import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/database/user/user.service';
import {Request} from 'express'
@Controller('users')
export class UsersController {

    constructor(private userService:UserService){}

    @Get(":idOrEmail")
    @UseGuards(AuthGuard)
    async getById(@Param('idOrEmail') idOrEmail:string, @Req() request:Request){
        var result = await this.userService.getById(idOrEmail);

        if(!result && request.currentUser.email == idOrEmail){
            //it could be we want to get the email
            result = await this.userService.getByEmail(idOrEmail);
        }

        return result;
    }


}
