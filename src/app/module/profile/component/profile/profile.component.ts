import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { ImageLoader } from 'src/app/module/shared/utilities/image-loader';
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
  private _profileImageLoader: ImageLoader;
  private _backgroundImageLoader: ImageLoader;
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

    this._profileImageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
    this._backgroundImageLoader = new ImageLoader(ImageLoader.typeOfImage.background);

    this._userID = this.route.snapshot.paramMap.get('uid');

    this.dbs.user.getSingle(this._userID)
      .subscribe(user => this.initializeUser(user));
  }

  private initializeUser(user: UserDetail){
    this._user = user;

    if(this._user.profileImageMetadata){
      this._profileImageLoader.createImageFromMetadata(this._user.profileImageMetadata);
      this.appendImage(this._profileImageLoader);
    }

    if(this._user.backgroundImageMetadata){
      this._backgroundImageLoader.createImageFromMetadata(this._user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageLoader);
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
      await this._profileImageLoader.createImageFromFile(file, this._userID);
    } catch (error){
      this.appendError(error);
      return;
    }

    this.appendImage(this._profileImageLoader);
    this.showActionsButtons();
  }

  private async loadBackgroundFile(event){
    const file: File = event.target.files[0];

    try{
      await this._backgroundImageLoader.createImageFromFile(file, this._userID);
    } catch (error){
      this.appendError(error);
      return;
    }

    this.appendImage(this._backgroundImageLoader);
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

  private appendImage(imgLoader: ImageLoader){
    let nodeName: string;

    if(imgLoader.typeOf == ImageLoader.typeOfImage.profile){
      nodeName = '.profile-image'
      this._profileImageChanged = true;
    }

    if(imgLoader.typeOf == ImageLoader.typeOfImage.background){
      nodeName = '.background-image'
      this._backgroundImageChanged = true;
    }

    const imgContainerRef = document.querySelector(nodeName);

    const imgEl = imgLoader.getImageHTMLElement();
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
      const uploadedImage = (await this.dbs.image.set(this._profileImageLoader.getMetadata())) as ImageMetadata;
      this._profileImageLoader.updateMetadata(uploadedImage);
      this._user.profileImageMetadata = this._profileImageLoader.getMetadata();
    }

    if(this._backgroundImageChanged){
      const uploadedImage = (await this.dbs.image.set(this._backgroundImageLoader.getMetadata())) as ImageMetadata;
      this._backgroundImageLoader.updateMetadata(uploadedImage);
      this._user.backgroundImageMetadata = this._backgroundImageLoader.getMetadata();
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
      this._profileImageLoader.createImageFromMetadata(this._user.profileImageMetadata);
      this.appendImage(this._profileImageLoader);
    }else{
      const imgContainerRef = document.querySelector('.profile-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    if(this._user.backgroundImageMetadata){
      this._backgroundImageLoader.createImageFromMetadata(this._user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageLoader);
    }else{
      const imgContainerRef = document.querySelector('.background-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    this.hideActionsButtons();
  }
}
