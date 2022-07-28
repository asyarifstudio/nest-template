import { Injectable, Scope } from '@nestjs/common';
import * as admin from 'firebase-admin'
import * as firestore from 'firebase-admin/firestore'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { CurrentUser } from './user';
@Injectable()
export class AuthService {

    oFireAuth: admin.auth.Auth;
    oFirestore: admin.firestore.Firestore
    currentUser:CurrentUser;
    constructor() {
        this.oFireAuth = admin.auth();
        this.oFirestore = firestore.getFirestore();
    }

    async verify(token: string):Promise<CurrentUser | undefined> {
        try{
            const idToken: DecodedIdToken = await this.oFireAuth.verifyIdToken(token);
            const uid:string = idToken.uid;
            const record = await this.oFirestore.doc(`users/${uid}`).get();
            const data = record.data();
            const recordInStore = await this.oFirestore.doc(`stores/${data.storeId}/users/${uid}`).get();
            const dataInStore = recordInStore.data();
            this.currentUser = {
                ...idToken,
            }
            return this.currentUser;
        }
        catch(error){
            return undefined;
        }
        
    }

    getUser():CurrentUser{
        return this.currentUser;
    }
}