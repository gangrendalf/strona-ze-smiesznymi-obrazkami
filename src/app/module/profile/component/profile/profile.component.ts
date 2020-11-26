import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, faEnvelope, faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { ImageLoader } from 'src/app/module/shared/utilities/image-loader';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

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
  private _subscription;
  
  public authUser: UserDetail = null;
  public user: UserDetail = null;
  public userIsProfileOwner: boolean = false;
  public imageLoadingFail: string = null;
  public actionButtonsHidden: boolean = true;

  public cameraIcon: IconDefinition = faCamera;
  public watchUserIcon: IconDefinition = faEye;
  public unwatchUserIcon: IconDefinition = faEyeSlash;
  public messageIcon: IconDefinition = faEnvelope;

  private readonly _imageNodes = {
    profile: '.profile-image',
    background: '.background-image'
  };

  constructor(private route: ActivatedRoute, private dbs: DatabaseService, private auth: AuthService) { 

    const routeSrc = route.paramMap
      .pipe(
        map(pm => pm.get('uid')),
        switchMap(uid => dbs.user.getSingle(uid))
      );

    const authSrc = auth.authState
      .pipe(
        switchMap(as => as.isLogged ? this.dbs.user.getSingle(as.user.uid) : of<UserDetail>(null)),
      );

    this._subscription = combineLatest(routeSrc, authSrc)
      .subscribe(val => {
        let reloadProfile = false;

        if(JSON.stringify(this.user) !== JSON.stringify(val[0]))
          reloadProfile = true;

        this.user = val[0];
        this.authUser = val[1];

        if(JSON.stringify(this.user) === JSON.stringify(this.authUser))
          this.userIsProfileOwner = true
        else
          this.userIsProfileOwner = false

        if(reloadProfile && this.user.profileImageMetadata){
          this._profileImageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
          this._profileImageLoader.createImageFromMetadata(this.user.profileImageMetadata);
          this.appendImageAt(this._imageNodes.profile ,this._profileImageLoader);
        } else if( !this.user.profileImageMetadata )
          this.removeImageAt(this._imageNodes.profile);
    
        if(reloadProfile && this.user.backgroundImageMetadata){
          this._backgroundImageLoader = new ImageLoader(ImageLoader.typeOfImage.background);
          this._backgroundImageLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
          this.appendImageAt(this._imageNodes.background, this._backgroundImageLoader);
        } else if( !this.user.backgroundImageMetadata)
          this.removeImageAt(this._imageNodes.background);
      })
  }

  ngOnDestroy(){
    if(this._subscription)   
      this._subscription.unsubscribe();
  }

  private appendImageAt(nodeName: string, imgLoader: ImageLoader){
    this.removeImageAt(nodeName);

    const newImgEl = imgLoader.getImageHTMLElement();
    newImgEl.classList.add('w-100')

    document.querySelector(nodeName).appendChild(newImgEl);
  }

  private removeImageAt(nodeSelector: string){
    const containerRef = document.querySelector(nodeSelector);

    for(let i = 0; i < containerRef.children.length; i++){
      const child: Element = containerRef.children.item(i);
      if(child.tagName == "IMG")
        child.remove();
    };
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
      await this._profileImageLoader.createImageFromFile(file, this.user.uid);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this._profileImageChanged = true;
    this.appendImageAt(this._imageNodes.profile, this._profileImageLoader);
    this.showActionsButtons();
  }

  public async loadBackgroundFile(event){
    const file: File = event.target.files[0];
    this.imageLoadingFail = null;

    try{
      await this._backgroundImageLoader.createImageFromFile(file, this.user.uid);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this._backgroundImageChanged = true;
    this.appendImageAt(this._imageNodes.background, this._backgroundImageLoader);
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
      this.appendImageAt(this._imageNodes.profile, this._profileImageLoader);
    }else
      this.removeImageAt(this._imageNodes.profile);
    

    if(this.user.backgroundImageMetadata){
      this._backgroundImageLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
      this.appendImageAt(this._imageNodes.background , this._backgroundImageLoader);
    }else
      this.removeImageAt(this._imageNodes.background)

    this.hideActionsButtons();
  }

  public watchUser(){
    // if(this.user.watchedUsers)
  }

  public unwatchUser(){

  }

  public sendMessageTo(){

  }
}
