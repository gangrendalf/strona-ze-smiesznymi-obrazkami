import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseInterface } from './database.interface';
import { ImageMetadata } from './image-metadata.interface';

export class ImageDatabaseModel implements DatabaseInterface<ImageMetadata>{
    constructor(public af: AngularFirestore, private afStorage: AngularFireStorage, private http: HttpClient){}

    getSingle(itemID: string, parentID?: string): Observable<ImageMetadata> {
        const storageRef: AngularFireStorageReference = 
            this.afStorage.ref(`mem/${parentID}/${itemID}`);

        return storageRef.getMetadata()
            .pipe(
                map(data => {
                    const imageMetadata: ImageMetadata = {
                        URL: data.customMetadata.path,
                        uid: data.customMetadata.uid,
                        id: data.customMetadata.id
                    }
                    return imageMetadata;
                }
            ))
    }

    getAll(parentID?: string): Observable<ImageMetadata[]> {
        throw new Error('Method not implemented.');
    }

    async set(data: ImageMetadata, parentID?: string): Promise<void | ImageMetadata> {
        if(!data.id)
            data.id = this.af.createId();
            
        const storageRef: AngularFireStorageReference = 
            this.afStorage.ref(`mem/${data.uid}/${data.id}`);

        const file: File = await this.getFileFromBlob(data.URL)
        
        let uploadTask: AngularFireUploadTask = 
            storageRef.put(file, {contentType: 'image/*', customMetadata: {id: data.id, uid: data.uid}});
        
        return new Promise((res, rej) => {
          uploadTask
            .then(
                async success => {
                    data.URL = await success.ref.getDownloadURL();
                    res(data); 
                },
                error => rej(error)
                );
            })
    }

    update(data: ImageMetadata, itemID: string, parentID?: string): Promise<string | void> {
        throw new Error('Method not implemented.');
    }

    private async getFileFromBlob(blobURL: string): Promise<File>{
        const blob = await this.http.get(blobURL, {responseType: 'blob'}).toPromise();
        const file: File = new File([blob], 'temp', {type: 'image/*'})
        return file;
    }
}
