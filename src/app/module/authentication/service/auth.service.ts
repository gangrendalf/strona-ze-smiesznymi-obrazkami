import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserRegisterData } from '../model/user-register-data';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { ReplaySubject, Observable } from 'rxjs';
import { AuthState } from '../model/auth-state';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: ReplaySubject<AuthState> = new ReplaySubject(1);
  private _authState: AuthState

  constructor(private fireAuth: AngularFireAuth, private dbs: DatabaseService) { 
    this.fireAuth.authState.subscribe(firebaseUser =>
      this.updateAuthState(firebaseUser)
    );
  }

  private async updateAuthState(firebaseUser: firebase.User){
    if(this.userLoggedIn(firebaseUser))
      await this.loadUserLoggedInData(firebaseUser);
    else
      this.loadUserLoggedOutData();

    this._authState$.next(this._authState);
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
    this._authState = {
      isLogged: false,
      user: undefined
    };
  }

  public get authState(): Observable<AuthState>{
    return this._authState$.asObservable();
  }

  public registerUser(data: UserRegisterData): Promise<void>{
    return new Promise((resolve, reject) => {
      try {
        this.fireAuth.auth
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
              isAdmin: false,
              profileImageMetadata: null,
              backgroundImageMetadata: null          
            }
            return userData
          })
          .then(userData => this.dbs.user.set(userData))
          .then(success => resolve())
          .catch(fail => {
            fail instanceof Error ?
              reject('AuthService Error: registerUser() - general error') :
              reject('AuthService Error: registerUser() - firebase rejection');
          });
      } catch (error) {
        reject('AuthService Error: registerUser() - general error');
      }
    })
  }

  public resetPassword(email: string): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      try {
        this.fireAuth.auth
        .sendPasswordResetEmail(email)
        .then(success => resolve())
        .catch(fail => reject('AuthService Error: resetPassword() - fireAuth rejection'));
      } catch (error) {
        reject('AuthService Error: resetPassword() - general error'); 
      }
    })
  }

  public login(email: string, password: string): Promise<void>{
    return new Promise((resolve, reject) => {
        try {
          this.fireAuth.auth
          .signInWithEmailAndPassword(email, password)
          .then(success => resolve())
          .catch(fail => reject('AuthService Error: login() - fireAuth rejection'));
        } catch (error) {
          reject('AuthService Error: login() - general error');          
        }
      })
  }

  public logout(): Promise<void>{
    return new Promise((resolve, reject) => {
      try {
        this.fireAuth.auth.signOut()
        .then(success => resolve())
        .catch(fail => reject('AuthService Error: logout() - fireAuth rejection'));
      } catch (error) {
        reject('AuthService Error: logout() - general error');        
      }
    })
  }
}
