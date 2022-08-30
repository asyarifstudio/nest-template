import { User } from "src/models/user/user";

export interface CurrentUser {
    uid:string,
    email:string,
    info:User
}

