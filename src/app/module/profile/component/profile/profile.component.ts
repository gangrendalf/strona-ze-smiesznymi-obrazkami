import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { ImageProcesor } from 'src/app/module/shared/temp/image.procesor';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnDestroy {

  private _cameraIcon: IconDefinition = faCamera;
  private _userID: string = null;
  private _user: UserDetail;
  private _authState$;
  private _profileImageProcessor: ImageProcesor;
  private _backgroundImageProcessor: ImageProcesor;
  private _profileImageChanged: boolean;
  private _backgroundImageChanged: boolean;

  private _navigationSubscription;

  constructor(private route: ActivatedRoute, private router: Router, private dbs: DatabaseService, private auth: AuthService) { 
    this._navigationSubscription = router.events.subscribe(e => {
      if(e instanceof NavigationEnd)
        this.initialize()
    })
  }

  private initialize(){
    this._authState$ = this.auth.authState;

    this._profileImageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);
    this._backgroundImageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.background);

    this._userID = this.route.snapshot.paramMap.get('uid');

    this.dbs.user.getSingle(this._userID)
      .subscribe(user => this.initializeUser(user));
  }

  private initializeUser(user: UserDetail){
    this._user = user;

    if(this._user.profileImageMetadata){
      this._profileImageProcessor.createImageFromMetadata(this._user.profileImageMetadata);
      this.appendImage(this._profileImageProcessor);
    }

    if(this._user.backgroundImageMetadata){
      this._backgroundImageProcessor.createImageFromMetadata(this._user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageProcessor);
    }
  }

  ngOnDestroy(){
    if (this._navigationSubscription)   
      this._navigationSubscription.unsubscribe();
  }

  private triggerSelectDialog(inputRef: HTMLInputElement){
    inputRef.click();
  }

  private async loadProfileFile(event){
    const file: File = event.target.files[0];

    try{
      await this._profileImageProcessor.createImageFromFile(file, this._userID);
    } catch (error){
      this.appendError(error);
      return;
    }

    this.appendImage(this._profileImageProcessor);
    this.showActionsButtons();
  }

  private async loadBackgroundFile(event){
    const file: File = event.target.files[0];

    try{
      await this._backgroundImageProcessor.createImageFromFile(file, this._userID);
    } catch (error){
      this.appendError(error);
      return;
    }

    this.appendImage(this._backgroundImageProcessor);
    this.showActionsButtons();
  }

  private appendError(message: string){
    const spanRef = document.createElement('span');
    spanRef.textContent = message;

    document.querySelector('.error-box').append(spanRef);
    setTimeout(() => {
      spanRef.remove()
    }, 5000)
  }

  private appendImage(imgProc: ImageProcesor){
    let nodeName: string;

    if(imgProc.typeOf == ImageProcesor.typeOfImage.profile){
      nodeName = '.profile-image'
      this._profileImageChanged = true;
    }

    if(imgProc.typeOf == ImageProcesor.typeOfImage.background){
      nodeName = '.background-image'
      this._backgroundImageChanged = true;
    }

    const imgContainerRef = document.querySelector(nodeName);

    const imgEl = imgProc.getImageHTMLElement();
    imgEl.classList.add('w-100')

    if(!imgContainerRef.children.item(1))
      imgContainerRef.appendChild(imgEl);
    else
      imgContainerRef.replaceChild(imgEl, imgContainerRef.children.item(1));
  }

  private showActionsButtons(){
    document.querySelector('.actions').classList.remove('d-none')
    document.querySelector('.actions').classList.add('d-block');
  }

  private hideActionsButtons(){
    document.querySelector('.actions').classList.remove('d-block');
    document.querySelector('.actions').classList.add('d-none')
  }

  private async saveChanges(){
    if(this._profileImageChanged){
      const uploadedImage = (await this.dbs.image.set(this._profileImageProcessor.getMetadata())) as ImageMetadata;
      this._profileImageProcessor.updateMetadata(uploadedImage);
      this._user.profileImageMetadata = this._profileImageProcessor.getMetadata();
    }

    if(this._backgroundImageChanged){
      const uploadedImage = (await this.dbs.image.set(this._backgroundImageProcessor.getMetadata())) as ImageMetadata;
      this._backgroundImageProcessor.updateMetadata(uploadedImage);
      this._user.backgroundImageMetadata = this._backgroundImageProcessor.getMetadata();
    }

    this.dbs.user.update(this._user).then(
      success => {
        this._profileImageChanged = false;
        this._backgroundImageChanged = false;

        this.hideActionsButtons();
      },
      fail => {
        console.error("nie udalo sie zapisac obrazow do bazy danych!");
      }
    )
  }

  private cancelChanges(){
    this._profileImageChanged = false;
    this._backgroundImageChanged = false;

    if(this._user.profileImageMetadata){
      this._profileImageProcessor.createImageFromMetadata(this._user.profileImageMetadata);
      this.appendImage(this._profileImageProcessor);
    }else{
      const imgContainerRef = document.querySelector('.profile-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    if(this._user.backgroundImageMetadata){
      this._backgroundImageProcessor.createImageFromMetadata(this._user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageProcessor);
    }else{
      const imgContainerRef = document.querySelector('.background-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    this.hideActionsButtons();
  }
}
