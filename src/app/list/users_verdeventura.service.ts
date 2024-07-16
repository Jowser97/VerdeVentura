import { Injectable, inject } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { APP_CONSTANTS } from '../shared/constants';
import { user_VV } from '../interfaces/verdeventura.interfaces';
import { Observable } from 'rxjs';

Injectable({providedIn:'root'})

export class VVService {
    private readonly _firestore = inject(Firestore);
    private readonly _VVCollection = collection (this._firestore, APP_CONSTANTS.COLLECTION_NAME);

    newUserVV(user_VV:Partial<user_VV>):Promise<DocumentReference<DocumentData, DocumentData>>  {
        return addDoc(this._VVCollection, {
            created: Date.now(),
            updated: Date.now(),
            ...user_VV,
        })
    }

    getAllUsers(): Observable<user_VV[]>{
        const queryFn = query(this._VVCollection, orderBy('created', 'desc'));
        return collectionData(queryFn, {idField:'id'}) as Observable<user_VV[]>
    }

    async getUser_VVById(id: string){
        const DocumentReference =this._getDocRef(id);
        const DocumentData = await getDoc(DocumentReference);
        return DocumentData.data() as user_VV;
    }

    updateUser_VV(id: string, user_VV: user_VV): void{
        const DocumentReference =this._getDocRef(id);
        updateDoc(DocumentReference, {...user_VV})
    }

    deleteUser_VV(id: string): void{
        const DocumentReference =this._getDocRef(id);
        deleteDoc(DocumentReference);
    }

    private _getDocRef(id:string){
        return doc(this._firestore, APP_CONSTANTS.COLLECTION_NAME, id);
    }
}