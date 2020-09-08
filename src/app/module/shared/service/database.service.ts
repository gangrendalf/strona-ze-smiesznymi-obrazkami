import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import { IItem } from '../../../model/item';
import { ICategory } from '../../../model/category';
import { IItemInfo } from '../../../model/item-info';
import { IUser, testUser } from '../../../model/user';
import { Observable } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private af: AngularFirestore, private afStorage: AngularFireStorage) { }

  public getItemsCount(): Promise<number> {
    let collRef: AngularFirestoreCollection<IItemInfo>;
    collRef = this.af.collection('item-info');

    return collRef.valueChanges().pipe(
        take(1),
        map(r => r.length))
      .toPromise();
  }

  public getItemsIds(): Promise<string[]>{
    let collRef: AngularFirestoreCollection<IItemInfo>;
    collRef = this.af.collection('item-info', q => q.orderBy('creationDate')); 

    return collRef.valueChanges()
      .pipe(
        take(1),
        map( items => items.map(item => item.itemId) ))
      .toPromise();
  }

  public getItem(id: string): Promise<IItem>{
    let docRef: AngularFirestoreDocument<IItem>;
    docRef = this.af.doc('item/' + id);

    return docRef.valueChanges()
      .pipe(
        take(1))
      .toPromise();
  }

  public async setItemAndItemInfo(mem: IItem, file: File){
    mem.imageURL = (await this.setImageFile(file, mem.author.uid));
    
    let collRef: AngularFirestoreCollection<IItem>;
    collRef = this.af.collection('item');   
    collRef.add(mem)
      .then(res => {
        let collRef: AngularFirestoreCollection<IItemInfo> = this.af.collection('item-info');
        let data: IItemInfo = {
          itemId: res.id,
          categoryId: 'testCategoryId',
          creationDate: mem.creationDate
        };
        collRef.add(data);
      });
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

  public getUser(id: string): Promise<IUser> {
    let docRef: AngularFirestoreDocument<IUser>;
    docRef = this.af.doc('user/' + id);

    return docRef.valueChanges()
      .pipe(
        take(1))
      .toPromise();
  }

  public setUser(data: IUser){
    let collRef: AngularFirestoreDocument<IUser>;
    collRef = this.af.doc('user/' + data.uid);

    collRef.set(data);
  }
}
