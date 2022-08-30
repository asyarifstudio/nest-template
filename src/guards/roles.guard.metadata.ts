import { SetMetadata } from "@nestjs/common"

export const UserRoles = (...roles: string[])=>{
    return SetMetadata('UserRoles',roles);
}