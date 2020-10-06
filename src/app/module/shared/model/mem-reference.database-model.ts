import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MemReference } from './mem-reference.interface';
import { DatabaseInterface } from './database.interface';

export class MemReferenceDatabaseModel implements DatabaseInterface<MemReference> {
    constructor(public af: AngularFirestore){}

    getSingle(itemID: string, parentID?: string): Observable<MemReference> {
        throw new Error('Method not implemented.');
    }

    getAll(parentID?: string): Observable<MemReference[]> {
        const collRef: AngularFirestoreCollection<MemReference> = 
            this.af.collection('item-info', q => q.orderBy('creationDate')); 
    
        return collRef.valueChanges();
    }

    set(data: MemReference, parentID?: string): Promise<void | Object> {
        const itemID: string = this.af.createId();
        const docRef: AngularFirestoreDocument<MemReference> = 
            this.af.doc(`item-info/${itemID}`);

        return docRef.set(data);
    }
    
    update(data: MemReference, itemID: string, parentID?: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
