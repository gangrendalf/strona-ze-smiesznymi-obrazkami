import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserRegisterData } from '../model/user-register-data';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { ReplaySubject, Observable } from 'rxjs';
import { AuthState } from '../model/auth-state';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: ReplaySubject<AuthState> = new ReplaySubject(1);

  constructor(private fireAuth: AngularFireAuth, private dbs: DatabaseService) { 
    this.fireAuth.authState
      .pipe(
        switchMap(firebaseUser => 
          this.userLoggedIn(firebaseUser) 
            ? this.loadUserLoggedInData(firebaseUser)
            : this.loadUserLoggedOutData()
        ))
      .subscribe(authState => this._authState$.next(authState));
  }

  private userLoggedIn(firebaseUser: firebase.User){
    return firebaseUser ? true : false;
  }

  private loadUserLoggedInData(firebaseUser: firebase.User): Promise<AuthState> {
    return this.dbs.user
      .getSingle(firebaseUser.uid)
      .pipe(
        take(1),
        map( user => <AuthState>{
          isLogged: true,
          user: {
            isAdmin: user.isAdmin,
            isModerator: user.isModerator,
            nick: user.nick,
            uid: user.uid
          }
        }))
      .toPromise()
  }

  private loadUserLoggedOutData(): Promise<AuthState> {
    return Promise.resolve(<AuthState>{
      isLogged: false,
      user: undefined
    }) 
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
              watchedUsers: null,
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
