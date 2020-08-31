import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUserRegisterData } from '../model/user-register-data';
import { IUser } from '../model/user';
import { DatabaseService } from './database.service';
import { IUserLoginData } from '../model/user-login-data';
import { ReplaySubject, Observable } from 'rxjs';
import { IAuthState } from '../model/auth-state';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: ReplaySubject<IAuthState> = new ReplaySubject(1);
  public authState$: Observable<IAuthState> = this._authState$.asObservable();

  constructor(private auth: AngularFireAuth, private dbs: DatabaseService) { 
    this.auth.authState
      .pipe(
        map(user => user ? user.uid : null)
      )
      .subscribe(uid => 
        this.getUserDetail(uid)
      );
  }

  public registerUser(data: IUserRegisterData){
    this.auth.auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(res => {
        let userData: IUser = {
          uid: res.user.uid,
          nick: data.nick,
          email: data.email,
          birthdate: data.birthdate,
          addedMems: 0,
          addedComments: 0,
          summaryDownvotes: 0,
          summaryUpvotes: 0,
          watchedTags: null,
          watchedUsers: 0
        }
        
        this.dbs.setUser(userData);
      });
  }

  public login(data: IUserLoginData){
    this.auth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        let uid: string = res.user.uid;
        this.getUserDetail(uid);
      });
  }

  public logout(){
    this.auth.auth.signOut();
  }

  private async getUserDetail(uid: string){
    let userData: IUser = null;
    let isLogged: boolean = false;

    if(uid){
      userData = await this.dbs.getUser(uid);
      isLogged = true;
    };

    this._authState$.next({isLogged: isLogged, user: userData});
  }
}
