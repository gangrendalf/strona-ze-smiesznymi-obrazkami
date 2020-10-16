import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { DatabaseInterface } from './database.interface';

export class UserDatabaseModel implements DatabaseInterface<UserDetail>{
    constructor(public af: AngularFirestore){}

    getSingle(itemID: string, parentID?: string): Observable<UserDetail> {
        const docRef: AngularFirestoreDocument<UserDetail> = 
            this.af.doc('user/' + itemID);
    
        return docRef.valueChanges();
    }

    getAll(parentID?: string): Observable<UserDetail[]> {
        throw new Error('Method not implemented.');
    }

    set(data: UserDetail, parentID?: string): Promise<void | UserDetail> {
        const docRef: AngularFirestoreDocument<UserDetail> = 
            this.af.doc('user/' + data.uid);
    
        return docRef.set(data);
    }
    
    update(data: UserDetail, itemID?: string, parentID?: string): Promise<void> {
    const docRef: AngularFirestoreDocument<UserDetail> = 
        this.af.doc('user/' + data.uid);

    return docRef.update(data);
    }
}
