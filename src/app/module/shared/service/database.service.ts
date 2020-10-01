import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestoreCollectionGroup } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import { IItem } from '../../../model/item';
import { ICategory } from '../../../model/category';
import { IItemInfo } from '../../../model/item-info';
import { IUserDetail } from '../../../model/user';
import { Observable } from 'rxjs';
import { IComment } from 'src/app/model/comment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private af: AngularFirestore, private afStorage: AngularFireStorage) { }

  public getItemsReference(): Observable<IItemInfo[]>{
    let collRef: AngularFirestoreCollection<IItemInfo>;
    collRef = this.af.collection('item-info', q => q.orderBy('creationDate')); 

    return collRef.valueChanges();
  }

  public getItem(id: string): Observable<IItem>{
    let docRef: AngularFirestoreDocument<IItem>;
    docRef = this.af.doc('item/' + id);

    return docRef.valueChanges();
  }

  public async createItemAndItemInfo(mem: IItem, file: File){
    mem.imageURL = (await this.setImageFile(file, mem.author.uid));
    
    let collRef: AngularFirestoreCollection<IItem>;
    collRef = this.af.collection('item');   
    collRef.add(mem)
      .then(res => {
        let collRef: AngularFirestoreCollection<IItemInfo> = this.af.collection('item-info');
        let data: IItemInfo = {
          itemId: res.id,
          categoryId: mem.category,
          creationDate: mem.creationDate
        };
        collRef.add(data);
      });
  }

  public updateItem(id: string, item: IItem){
    let docRef: AngularFirestoreDocument<IItem>;
    docRef = this.af.doc(`item/${id}`);

    docRef.update(item);
  }

  public getCategory(): Promise<ICategory[]>{
    let collRef: AngularFirestoreCollection<ICategory>;
    collRef = this.af.collection('category', query => query.orderBy('name'));
    
    return collRef.valueChanges()
      .pipe(
        take(1))
      .toPromise();
  }

  public setCategory(category: ICategory){
    let collRed: AngularFirestoreCollection<ICategory>;
    collRed = this.af.collection('category');

    collRed.add(category);
  }

  private setImageFile(file: File, uid: string): Promise<any> {
    let id: string;
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;

    id = new Date().getTime().toString();
    storageRef = this.afStorage.ref(`mem/${uid}/${id}`);
    uploadTask = storageRef.put(file, {contentType: 'image/*'});
  
    return new Promise((res, rej) => {
      uploadTask.then(
        success => {
          let url = success.ref.getDownloadURL();
          res(url);
        },
        error => {
          let url = 'https://firebasestorage.googleapis.com/v0/b/strona-ze-smiesznymi-obrazkami.appspot.com/o/default%2Fimage-not-found.jpg?alt=media&token=d9379363-8df5-46e6-9f7f-821f9a39d507'
          rej(url);
        }
        );
    })
  }

  public getUser(id: string): Promise<IUserDetail> {
    let docRef: AngularFirestoreDocument<IUserDetail>;
    docRef = this.af.doc('user/' + id);

    return docRef.valueChanges()
      .pipe(
        take(1))
      .toPromise();
  }

  public setUser(data: IUserDetail){
    let docRef: AngularFirestoreDocument<IUserDetail>;
    docRef = this.af.doc('user/' + data.uid);

    docRef.set(data);
  }

  public getComments(memId: string, responseTo?: string[]): Observable<IComment[]>{
    let collRef: AngularFirestoreCollection<IComment>;
    collRef = this.af.collection(`item/${memId}/comments`, q => q.orderBy('date'));

    return collRef.valueChanges();
  }

  public setComments(memId: string, comment: IComment, responseTo?: string[]){
    let docRef: AngularFirestoreDocument<IComment>;
    docRef = this.af.doc(`item/${memId}/comments/${comment.date.toString()}`);
    
    docRef.set(comment);
  }

  public updateComment(memId: string, comment: IComment, responseTo?: string[]){
    let docRef: AngularFirestoreDocument<IComment>;
    docRef = this.af.doc(`item/${memId}/comments/${comment.date.toString()}`);
    
    docRef.update(comment);
  }
}
