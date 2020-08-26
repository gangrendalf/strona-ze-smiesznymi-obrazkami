import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators';
import { Mem } from '../model/mem';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private af: AngularFirestore) { }

  public getMemCount(): Promise<number> {
    let res: AngularFirestoreCollection = this.af.collection('mem');
    return res.valueChanges().pipe(
        take(1),
        map(r => r.length)
      ).toPromise();
  }

  public getMem(id: string): Promise<Mem>{
    let res = this.af.doc<Mem>('mem/' + id);
    return res.valueChanges().pipe(take(1)).toPromise();
  }

  public getMemsIds(): Promise<string[]>{
    return this.af.collection('mem', q => q.orderBy('creationDate')).snapshotChanges()
      .pipe(
        take(1),
        map( res => res.map(x => x.payload.doc.id) )
      )
      .toPromise();
  }

  public setMem(mem: Mem){
    this.af.collection('mem').add(mem);
  }
}
