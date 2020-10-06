import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Mem } from '../model/mem.interface';
import { MemReference } from '../model/mem-reference.interface';
import { CommentDatabaseModel } from '../model/comment.database-model';
import { CategoryDatabaseModel } from '../model/category.database-model';
import { UserDatabaseModel } from '../model/user.database-model';
import { MemDatabaseModel } from '../model/mem.database-model';
import { MemReferenceDatabaseModel } from '../model/mem-reference.database-model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public comment: CommentDatabaseModel;
  public category: CategoryDatabaseModel;
  public user: UserDatabaseModel;
  public mem: MemDatabaseModel;
  public memReference: MemReferenceDatabaseModel;
  

  constructor(public af: AngularFirestore, private afStorage: AngularFireStorage) { 
    this.comment = new CommentDatabaseModel(af);
    this.category = new CategoryDatabaseModel(af);
    this.user = new UserDatabaseModel(af);
    this.mem = new MemDatabaseModel(af);
    this.memReference = new MemReferenceDatabaseModel(af);
  }

  public async createItemAndItemInfo(mem: Mem, file: File){
    mem.imageURL = (await this.setImageFile(file, mem.author.uid));
    
    this.mem.set(mem)
      .then(
        (res) => this.memReference.set(res as MemReference)
      );

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
}
