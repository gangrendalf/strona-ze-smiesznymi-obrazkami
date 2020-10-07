import { AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface DatabaseInterface<T> {
    getSingle(itemID: string, parentID?: string): Observable<T>;
    getAll(parentID?: string): Observable<T[]>;
    set(data: T, parentID?: string): Promise<void | T>;
    update(data: T, itemID: string, parentID?: string): Promise<void | string>;
}
