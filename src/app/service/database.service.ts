import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators';
import { IItem } from '../model/item';
import { ICategory } from '../model/category';
import { IItemInfo } from '../model/item-info';
import { IUser } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private af: AngularFirestore) { }

  public getItemsCount(): Promise<number> {
    let collRef: AngularFirestoreCollection<IItemInfo> = this.af.collection('item-info');

    return collRef.valueChanges().pipe(
        take(1),
        map(r => r.length)
      ).toPromise();
  }

  public getItemsIds(): Promise<string[]>{
    let collRef: AngularFirestoreCollection<IItemInfo> = this.af.collection('item-info', q => q.orderBy('creationDate')); 

    return collRef.valueChanges()
      .pipe(
        take(1),
        map( items => items.map(item => item.itemId) )
      )
      .toPromise();
  }

  public getItem(id: string): Promise<IItem>{
    let docRef = this.af.doc<IItem>('item/' + id);

    return docRef.valueChanges()
      .pipe(
        take(1)
        )
      .toPromise();
  }

  public setItemAndItemInfo(mem: IItem){ 
    let collRef: AngularFirestoreCollection<IItem> = this.af.collection('item');   
    
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
    let collRef = this.af.collection<ICategory>('category', query => query.orderBy('name'));
    
    return collRef.valueChanges()
      .pipe(
        take(1)
      )
      .toPromise();
  }

  public setCategory(category: ICategory){
    let collRed = this.af.collection<ICategory>('category');

    collRed.add(category);
  }

  public getUser(id: string): Promise<IUser> {
    let docRef: AngularFirestoreDocument<IUser> = this.af.doc('user/' + id);

    return  docRef.valueChanges()
      .pipe(
        take(1)
      )
      .toPromise();
  }

  public setUser(data: IUser){
    let collRef: AngularFirestoreDocument<IUser> = this.af.doc('user/' + data.uid);

    collRef.set(data);
  }
}
