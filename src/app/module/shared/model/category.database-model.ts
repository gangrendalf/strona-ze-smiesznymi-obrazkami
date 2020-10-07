import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from 'src/app/module/shared/model/category.interface';
import { DatabaseInterface } from './database.interface';

export class CategoryDatabaseModel implements DatabaseInterface<Category>{
    constructor(public af: AngularFirestore){}

    getSingle(itemID: string, parentID?: string): Observable<Category> {
        throw new Error('Method not implemented.');
    }

    getAll(parentID?: string): Observable<Category[]> {
        const collRef: AngularFirestoreCollection<Category> = 
            this.af.collection('category', query => query.orderBy('name'));
        
        return collRef.valueChanges();
    }

    set(data: Category, parentID?: string): Promise<void | Category> {
        const itemID: string = this.af.createId();
        const docRef: AngularFirestoreDocument<Category> = 
            this.af.doc(`category/${itemID}`);

        return docRef.set(data);
    }
    
    update(data: Category, itemID: string, parentID?: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
