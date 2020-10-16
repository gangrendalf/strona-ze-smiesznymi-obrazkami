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
import { ImageMetadata } from '../model/image-metadata.interface';
import { ImageDatabaseModel } from '../model/image.database-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public comment: CommentDatabaseModel;
  public category: CategoryDatabaseModel;
  public user: UserDatabaseModel;
  public mem: MemDatabaseModel;
  public memReference: MemReferenceDatabaseModel;
  public image: ImageDatabaseModel;

  constructor(private af: AngularFirestore, private afStorage: AngularFireStorage, private http: HttpClient) { 
    this.comment = new CommentDatabaseModel(af);
    this.category = new CategoryDatabaseModel(af);
    this.user = new UserDatabaseModel(af);
    this.memReference = new MemReferenceDatabaseModel(af);
    this.mem = new MemDatabaseModel(af);
    this.image = new ImageDatabaseModel(af, afStorage, http);
  }
}
