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

  private _profileImageLoader: ImageLoader;
  private _backgroundImageLoader: ImageLoader;
  private _profileImageChanged: boolean;
  private _backgroundImageChanged: boolean;
  
  private _navigationSubscription;
  
  public authState$;
  public user: UserDetail;
  public userID: string = null;
  public imageLoadingFail: string = null;
  public actionButtonsHidden: boolean = true;
  public cameraIcon: IconDefinition = faCamera;

  constructor(private route: ActivatedRoute, private router: Router, private dbs: DatabaseService, private auth: AuthService) { 
    this._navigationSubscription = router.events.subscribe(e => {
      if(e instanceof NavigationEnd)
        this.initialize();
    });
  }

  private initialize(){
    this.authState$ = this.auth.authState;

    this._profileImageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
    this._backgroundImageLoader = new ImageLoader(ImageLoader.typeOfImage.background);

    this.userID = this.route.snapshot.paramMap.get('uid');

    this.dbs.user.getSingle(this.userID)
      .subscribe(user => this.initializeUser(user));
  }

  private initializeUser(user: UserDetail){
    this.user = user;

    if(this.user.profileImageMetadata){
      this._profileImageLoader.createImageFromMetadata(this.user.profileImageMetadata);
      this.appendImage(this._profileImageLoader);
    }

    if(this.user.backgroundImageMetadata){
      this._backgroundImageLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageLoader);
    }
  }

  ngOnDestroy(){
    if (this._navigationSubscription)   
      this._navigationSubscription.unsubscribe();
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
    this.actionButtonsHidden = false;
  }

  private hideActionsButtons(){
    this.actionButtonsHidden = true;
  }

  public triggerSelectDialog(inputRef: HTMLInputElement){
    inputRef.click();
  }

  public async loadProfileFile(event){
    const file: File = event.target.files[0];
    this.imageLoadingFail = null;

    try{
      await this._profileImageLoader.createImageFromFile(file, this.userID);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this.appendImage(this._profileImageLoader);
    this.showActionsButtons();
  }

  public async loadBackgroundFile(event){
    const file: File = event.target.files[0];
    this.imageLoadingFail = null;

    try{
      await this._backgroundImageLoader.createImageFromFile(file, this.userID);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this.appendImage(this._backgroundImageLoader);
    this.showActionsButtons();
  }

  public async saveChanges(){
    if(this._profileImageChanged){
      const uploadedImage = (await this.dbs.image.set(this._profileImageLoader.getMetadata())) as ImageMetadata;
      this._profileImageLoader.updateMetadata(uploadedImage);
      this.user.profileImageMetadata = this._profileImageLoader.getMetadata();
    }

    if(this._backgroundImageChanged){
      const uploadedImage = (await this.dbs.image.set(this._backgroundImageLoader.getMetadata())) as ImageMetadata;
      this._backgroundImageLoader.updateMetadata(uploadedImage);
      this.user.backgroundImageMetadata = this._backgroundImageLoader.getMetadata();
    }

    this.dbs.user.update(this.user).then(
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

  public cancelChanges(){
    this._profileImageChanged = false;
    this._backgroundImageChanged = false;

    if(this.user.profileImageMetadata){
      this._profileImageLoader.createImageFromMetadata(this.user.profileImageMetadata);
      this.appendImage(this._profileImageLoader);
    }else{
      const imgContainerRef = document.querySelector('.profile-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    if(this.user.backgroundImageMetadata){
      this._backgroundImageLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
      this.appendImage(this._backgroundImageLoader);
    }else{
      const imgContainerRef = document.querySelector('.background-image');
      const imgRef = imgContainerRef.querySelector('img');
      imgRef ? imgRef.remove() : null;
    }

    this.hideActionsButtons();
  }
}
