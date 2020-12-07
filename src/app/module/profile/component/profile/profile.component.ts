import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
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

  private _avatarLoader: ImageLoader;
  private _backgroundLoader: ImageLoader;
  private _avatarChanged: boolean;
  private _backgroundChanged: boolean;
  private _subscription;
  
  public authUser: UserDetail = null;
  public user: UserDetail = null;
  public userIsProfileOwner: boolean = false;
  public imageLoadingFail: string = null;
  public imageActionsButtonsHidden: boolean = true;

  public cameraIcon: IconDefinition = faCamera;

  private readonly _imageNodes = {
    avatar: '.avatar-image',
    background: '.background-image'
  };

  constructor(private route: ActivatedRoute, private dbs: DatabaseService, private auth: AuthService) { 

    this._avatarLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
    this._backgroundLoader = new ImageLoader(ImageLoader.typeOfImage.background);

    const userSrc = route.paramMap
      .pipe(
        map(pm => pm.get('uid')),
        switchMap(uid => dbs.user.getSingle(uid))
      );

    const authUserSrc = auth.authState
      .pipe(
        switchMap(as => as.isLogged ? this.dbs.user.getSingle(as.user.uid) : of<UserDetail>(null)),
      );

    this._subscription = combineLatest(userSrc, authUserSrc)
      .subscribe(val => {
        let reloadImages = false;

        if(JSON.stringify(this.user) !== JSON.stringify(val[0]))
          reloadImages = true;

        this.user = val[0];
        this.authUser = val[1];

        if(JSON.stringify(this.user) === JSON.stringify(this.authUser))
          this.userIsProfileOwner = true
        else
          this.userIsProfileOwner = false

        if(reloadImages && this.user.profileImageMetadata){
          this._avatarLoader.createImageFromMetadata(this.user.profileImageMetadata);
          this.appendImageAt(this._imageNodes.avatar ,this._avatarLoader);
        } else if( !this.user.profileImageMetadata )
          this.removeImageAt(this._imageNodes.avatar);
    
        if(reloadImages && this.user.backgroundImageMetadata){
          this._backgroundLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
          this.appendImageAt(this._imageNodes.background, this._backgroundLoader);
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

    if(!containerRef.children)
      return;
      
    for(let i = 0; i < containerRef.children.length; i++){
      const child: Element = containerRef.children.item(i);
      if(child.tagName == "IMG")
        child.remove();
    };
  }

  private showImageActionsButtons(){
    this.imageActionsButtonsHidden = false;
  }

  private hideImageActionsButtons(){
    this.imageActionsButtonsHidden = true;
  }

  public triggerSelectDialog(inputRef: HTMLInputElement){
    inputRef.click();
  }

  public async loadAvatarFile(event){
    const file: File = event.target.files[0];
    this.imageLoadingFail = null;

    try{
      await this._avatarLoader.createImageFromFile(file, this.user.uid);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this._avatarChanged = true;
    this.appendImageAt(this._imageNodes.avatar, this._avatarLoader);
    this.showImageActionsButtons();
  }

  public async loadBackgroundFile(event){
    const file: File = event.target.files[0];
    console.log(event);
    this.imageLoadingFail = null;

    try{
      await this._backgroundLoader.createImageFromFile(file, this.user.uid);
    } catch (error){
      this.imageLoadingFail = error;
      return;
    }

    this._backgroundChanged = true;
    this.appendImageAt(this._imageNodes.background, this._backgroundLoader);
    this.showImageActionsButtons();
  }

  public async saveImagesChanges(){
    if(this._avatarChanged){
      const uploadedImage = (await this.dbs.image.set(this._avatarLoader.getMetadata())) as ImageMetadata;
      this._avatarLoader.updateMetadata(uploadedImage);
      this.user.profileImageMetadata = this._avatarLoader.getMetadata();
    }

    if(this._backgroundChanged){
      const uploadedImage = (await this.dbs.image.set(this._backgroundLoader.getMetadata())) as ImageMetadata;
      this._backgroundLoader.updateMetadata(uploadedImage);
      this.user.backgroundImageMetadata = this._backgroundLoader.getMetadata();
    }

    this.dbs.user.update(this.user).then(
      success => {
        this._avatarChanged = false;
        this._backgroundChanged = false;

        this.hideImageActionsButtons();
      },
      fail => {
        console.error("nie udalo sie zapisac obrazow do bazy danych!");
      }
    )
  }

  public cancelImagesChanges(){
    this._avatarChanged = false;
    this._backgroundChanged = false;

    if(this.user.profileImageMetadata){
      this._avatarLoader.createImageFromMetadata(this.user.profileImageMetadata);
      this.appendImageAt(this._imageNodes.avatar, this._avatarLoader);
    }else
      this.removeImageAt(this._imageNodes.avatar);
    
    if(this.user.backgroundImageMetadata){
      this._backgroundLoader.createImageFromMetadata(this.user.backgroundImageMetadata);
      this.appendImageAt(this._imageNodes.background , this._backgroundLoader);
    }else
      this.removeImageAt(this._imageNodes.background)

    this.hideImageActionsButtons();
  }
}
