import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { DatabaseInterface } from './database.interface';

export class CommentDatabaseModel implements DatabaseInterface<Comment> {
    constructor(public af: AngularFirestore){}

    public getSingle(itemID: string, parentID?: string): Observable<Comment> {
        throw new Error('Method not implemented.');
    }

    public getAll(parentID?: string): Observable<Comment[]> {
        const collRef: AngularFirestoreCollection<Comment> = 
            this.af.collection(`item/${parentID}/comments`, q => q.orderBy('date'));
    
        return collRef.valueChanges();
    }
    
    public set(data: Comment, parentID?: string): Promise<void | Comment> {
        const itemID: string = this.af.createId();
        data.id = itemID;
        
        const docRef: AngularFirestoreDocument<Comment> = 
            this.af.doc(`item/${parentID}/comments/${itemID}`);
        
        return docRef.set(data);
    }

    public update(data: Comment, itemID: string, parentID?: string): Promise<void> {
        const docRef: AngularFirestoreDocument<Comment> = 
            this.af.doc(`item/${parentID}/comments/${itemID}`);
        
        return docRef.update(data);
    }
}
