import * as firestore from 'firebase-admin/firestore'
import { environment } from "src/env";
import { Model } from "src/models/model";

export class DatabaseService<M extends Model>{

    protected oFireStore: firestore.Firestore;
    protected path:string
    constructor(path:string){
        this.oFireStore = firestore.getFirestore();
        if(environment.production){
            this.path = `data/prod/${path}`
        }
        else{
            this.path = `data/dev/${path}`
        }
    }


    get 
    collection():firestore.CollectionReference {
        return this.oFireStore.collection(this.path);
    }

    protected getDocumentRef(id: string): firestore.DocumentReference<firestore.DocumentData> {
        return this.collection.doc(id);
    }

    async get():Promise<M[]>{
        const query = this.collection;
        return this.find(query);
    }

    async getById(id: string): Promise<M> {
        const snapshot = await this.collection.doc(id).get();
        if(!snapshot.exists){
            return undefined;
        }
        return {
            'id':snapshot.id,
            ...snapshot.data()
        } as M;

    }
    

    async add(m: M): Promise<M> {
        //mandatory to call sanitize before saving the data
        m = this.sanitize(m);

        const record = await this.collection.add(m);
        return this.getById(record.id);
    }

    async update(id:string,m:M):Promise<M>{
        //mandatory to call sanitize before saving the data
        m = this.sanitize(m);

        const ref = this.getDocumentRef(id);
        await ref.set(m);
        return this.getById(id);
    }

    protected async find(query:FirebaseFirestore.Query):Promise<M[]>{
        const snapshot = await query.get();
        return snapshot.docs.map((doc)=>{
            return {
                id:doc.id,
                ...doc.data()
            } as M;
        })
    }

    protected async findOne(query:FirebaseFirestore.Query):Promise<M>{
        const snapshot = await query.get();
        if(snapshot.docs.length == 0 || snapshot.docs.length > 1){
            return undefined;
        }
        else{
            return {
                id:snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            } as M;
        }
    }

    protected sanitize(m:M):M{

        //set the date
        if(!m.createdAt)
            m.createdAt = m.updatedAt = Date.now();
        else{
            m.updatedAt = Date.now();
        }

        //delete ID if any
        delete m.id;

        //return the sanitize object
        return m;
    }

}