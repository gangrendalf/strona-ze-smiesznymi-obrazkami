import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseInterface } from './database.interface';
import { Image } from './image.interface';

export class ImageDatabaseModel implements DatabaseInterface<Image>{
    constructor(public af: AngularFirestore, private afStorage: AngularFireStorage){}

    getSingle(itemID: string, parentID?: string): Observable<Image> {
        const storageRef: AngularFireStorageReference = 
            this.afStorage.ref(`mem/${parentID}/${itemID}`);

        return combineLatest(storageRef.getMetadata(), storageRef.getDownloadURL())
            .pipe(
                map(data => {
                    const image: Image = {
                        file: null,
                        URL: data[1],
                        id: data[0].customMetadata.id,
                        uid: data[0].customMetadata.uid
                    }

                    return image;
                }
            ))
    }

    getAll(parentID?: string): Observable<Image[]> {
        throw new Error('Method not implemented.');
    }

    set(data: Image, parentID?: string): Promise<void | Image> {
        data.id = this.af.createId();
        
        const storageRef: AngularFireStorageReference = 
            this.afStorage.ref(`mem/${data.uid}/${data.id}`);
        
        let uploadTask: AngularFireUploadTask = 
            storageRef.put(data.file, {contentType: 'image/*', customMetadata: {id: data.id, uid: data.uid}});
        
        return new Promise((res, rej) => {
          uploadTask
            .then(
                async success => {
                    data.URL = await success.ref.getDownloadURL();
                    data.file = null;
                    res(data); 
                },
                error => rej(error)
                );
            })
    }

    update(data: Image, itemID: string, parentID?: string): Promise<string | void> {
        throw new Error('Method not implemented.');
    }
}
