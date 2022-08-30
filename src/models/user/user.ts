import { Model } from "../model";

export enum UserRole{

}

export interface User extends Model {
    name:string;
    email:string;
    roles:UserRole[]
}