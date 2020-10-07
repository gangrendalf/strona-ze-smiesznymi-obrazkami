import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { DatabaseInterface } from './database.interface';

export class MemDatabaseModel implements DatabaseInterface<Mem> {
    constructor(public af: AngularFirestore){}

    getSingle(itemID: string, parentID?: string): Observable<Mem> {
        const docRef: AngularFirestoreDocument<Mem> = 
            this.af.doc('item/' + itemID);
    
        return docRef.valueChanges();
    }

    getAll(parentID?: string): Observable<Mem[]> {
        throw new Error('Method not implemented.');
    }

    set(data: Mem, parentID?: string): Promise<void | Mem> {
        const itemID: string = this.af.createId();
        const collRef: AngularFirestoreDocument<Mem> = 
            this.af.doc(`item/${itemID}`);

        data.id = itemID;

        return new Promise((resolve, reject) => {
            collRef.set(data)
                .then(
                    () => resolve(data),
                    (error) => reject(error)
                )
        })
    }

    update(data: Mem, itemID: string, parentID?: string): Promise<void> {
        const docRef: AngularFirestoreDocument<Mem> = 
            this.af.doc(`item/${itemID}`);
    
        return docRef.update(data);
    }
}
