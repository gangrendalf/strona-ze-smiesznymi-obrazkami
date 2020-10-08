import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserRegisterData } from '../model/user-register-data';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { UserLoginData } from '../model/user-login-data';
import { ReplaySubject, Observable } from 'rxjs';
import { AuthState } from '../model/auth-state';
import { take } from 'rxjs/operators';

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
    const nick = 
      (await this.dbs.user
          .getSingle(uid)
          .pipe(take(1))
          .toPromise())
          .nick;

    this._authState = { isLogged: isLogged, user: {nick: nick, uid: uid}};
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

  public registerUser(data: UserRegisterData){
    this.auth.auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(res => {
        let userData: UserDetail = {
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
        
        this.dbs.user.set(userData);
      });
  }

  public resetPassword(email: string): Promise<void>{
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  public login(data: UserLoginData){
    this.auth.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  public logout(){
    this.auth.auth.signOut();
  }
}
