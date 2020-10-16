import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { first, tap } from 'rxjs/operators';
import { ImageProcesor } from 'src/app/module/shared/temp/image.procesor';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  private _cameraIcon: IconDefinition = faCamera;
  private _userID: string = null;
  private _user: UserDetail;
  private _profileImageProcessor: ImageProcesor;
  private _backgroundImageProcessor: ImageProcesor;

  constructor(private route: ActivatedRoute, private dbs: DatabaseService) { 
    this._profileImageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);
    this._backgroundImageProcessor = new ImageProcesor();

    this._userID = route.snapshot.paramMap.get('uid');

    this.dbs.user.getSingle(this._userID)
      .pipe(
        tap(user => {
          if(user.hasProfileBackgrundImage)
            this.dbs.image.getSingle('background', this._userID)
              .pipe(first())
              .subscribe(image => this._backgroundImageProcessor.createImageFromMetadata(image));
        }),
        tap(user => {
          if(user.hasProfileImage)
            this.dbs.image.getSingle('profile', this._userID)
              .pipe(first())
              .subscribe(image => this._profileImageProcessor.createImageFromMetadata(image));
        })
      )
      .subscribe(user => this._user = user);
  }

  private triggerSelectDialog(inputRef: HTMLInputElement){
    inputRef.click();
  }

  private async loadFile(event){
    const file: File = event.target.files[0];

    try{
      await this._profileImageProcessor.createImageFromFile(file, this._userID);
    } catch (error){
      this.appendError(error);
      return;
    }

    const parentNodeID: string = ((event as Event).target as Element).id;

    this.appendImage(parentNodeID);
    this.toggleSaveImageButtonVisibility();
  }

  private appendError(message: string){
    const spanRef = document.createElement('span');
    spanRef.textContent = message;

    document.querySelector('.error-box').append(spanRef);
    setTimeout(() => {
      spanRef.remove()
    }, 5000)
  }

  private appendImage(parentNodeID: string){
    const imgContainerRef = document.querySelector(`.${parentNodeID}`);

    const imgEl = this._profileImageProcessor.getImageHTMLElement();
    imgEl.classList.add('w-100')

    imgContainerRef.appendChild(imgEl);
  }

  private toggleSaveImageButtonVisibility(){
    document.querySelector('.actions').classList.remove('d-none')
    document.querySelector('.actions').classList.add('d-block');
  }

  private async saveChanges(){
    const uploadedImage = (await this.dbs.image.set(this._profileImageProcessor.getMetadata())) as ImageMetadata

    this._profileImageProcessor.updateMetadata(uploadedImage);

    this._user.hasProfileImage = true;

    this.dbs.user.update(this._user)
  }

  private cancelChanges(){

  }
}
