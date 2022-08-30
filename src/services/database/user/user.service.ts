import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user/user';
import { DatabaseService } from '../database.service';

@Injectable()
export class UserService extends DatabaseService<User>{

    constructor(){
        super("users")
    }
    async getByEmail(email:string):Promise<User>{
        const query = this.collection.where("email",'==',email);
        return this.findOne(query);
    }
}
