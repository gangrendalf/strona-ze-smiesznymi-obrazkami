import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserRegisterData } from '../model/user-register-data';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { UserLoginData } from '../model/user-login-data';
import { ReplaySubject, Observable } from 'rxjs';
import { AuthState } from '../model/auth-state';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: ReplaySubject<AuthState> = new ReplaySubject(1);
  private _authState: AuthState

  constructor(private auth: AngularFireAuth, private dbs: DatabaseService) { 
    this.auth.authState.subscribe
      (async firebaseUser =>{
        if(this.userLoggedIn(firebaseUser))
          await this.loadUserLoggedInData(firebaseUser);
        else
          this.loadUserLoggedOutData();

        this.updateAuthState();
      });
  }

  private userLoggedIn(firebaseUser: firebase.User){
    return firebaseUser ? true : false;
  }

  private async loadUserLoggedInData(firebaseUser: firebase.User): Promise<void>{
    const isLogged = true;
    const uid = firebaseUser.uid;

    const detail = 
      await this.dbs.user
        .getSingle(uid)
        .pipe(
        take(1),
        map( user => {
          return {
            nick: user.nick,
            isModerator: user.isModerator,
            isAdmin: user.isAdmin
            }
        }))
        .toPromise()
        

    this._authState = {
      isLogged: isLogged, 
      user: {
        uid: uid, 
        nick: detail.nick, 
        isModerator: detail.isModerator, 
        isAdmin: detail.isAdmin
      }};
  }

  private loadUserLoggedOutData(): void{
    this._authState = {isLogged: false};
  }

  private updateAuthState(){
    this._authState$.next(this._authState);
  }

  public get authState(): Observable<AuthState>{
    return this._authState$.asObservable();
  }

  public registerUser(data: UserRegisterData): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      this.auth.auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(res => {
        const userData: UserDetail = {
          uid: res.user.uid,
          nick: data.nick,
          email: data.email,
          birthdate: data.birthdate,
          addedMems: 0,
          addedComments: 0,
          summaryDownvotes: 0,
          summaryUpvotes: 0,
          watchedTags: null,
          watchedUsers: 0,
          isModerator: false,
          isAdmin: false
        }
        return userData
      }).then(userData => {
        return this.dbs.user.set(userData);
      }).then(success => {
        resolve();
      }).catch(fail => {
        console.error('tworzenie konta nie powiodlo sie');
        reject();
      })
    })
  }

  public resetPassword(email: string): Promise<void>{
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  public login(data: UserLoginData): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.auth.auth
        .signInWithEmailAndPassword(data.email, data.password)
        .then(
          success => resolve(true)
        ).catch(
          fail => reject('zle dane kolego')
        )
      })
  }

  public logout(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.auth.auth.signOut()
        .then(
          success => resolve(true)
        ).catch(
          fail => reject('nie udalo sie wylogowac')
        )
    })
  }
}
