import { Injectable, Scope } from '@nestjs/common';
import * as admin from 'firebase-admin'
import * as firestore from 'firebase-admin/firestore'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserService } from '../database/user/user.service';
import { CurrentUser } from './current-user';
@Injectable()
export class AuthService {

    oFireAuth: admin.auth.Auth;
    oFirestore: admin.firestore.Firestore
    constructor(private userService:UserService) {
        this.oFireAuth = admin.auth();
        this.oFirestore = firestore.getFirestore();
    }

    async verify(token: string):Promise<CurrentUser | undefined> {
        try{
            const idToken: DecodedIdToken = await this.oFireAuth.verifyIdToken(token);
            const uid:string = idToken.uid;
            const email:string = idToken.email;
            const record = await this.userService.getByEmail(email);
            return {
                uid,
                info:record
            }
        }
        catch(error){
            return undefined;
        }
        
    }

}