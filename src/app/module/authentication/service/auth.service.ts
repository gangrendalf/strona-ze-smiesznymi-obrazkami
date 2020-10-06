import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUserRegisterData } from '../../../model/user-register-data';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { IUserLoginData } from '../../../model/user-login-data';
import { ReplaySubject, Observable } from 'rxjs';
import { IAuthState } from '../../../model/auth-state';
import { map, take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: ReplaySubject<IAuthState> = new ReplaySubject(1);
  public authState$: Observable<IAuthState> = this._authState$.asObservable();

  constructor(
    private auth: AngularFireAuth, 
    private dbs: DatabaseService,
    private router: Router,
    private route: ActivatedRoute) 
    { 
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

  public login(data: IUserLoginData){
    this.auth.auth
      .signInWithEmailAndPassword(data.email, data.password);
  }

  public logout(){
    this.auth.auth
      .signOut();
  }

  private async getUserDetail(uid: string){
    let userData: UserDetail = null;
    let isLogged: boolean = false;

    if(uid){
      userData = await this.dbs.user.getSingle(uid).pipe(take(1)).toPromise();
      isLogged = true;
    };

    this._authState$.next({isLogged: isLogged, user: userData});
    
    this.redirectToOrigin();
  }

  private async redirectToOrigin(){
    let isRedirected: boolean = this.route.snapshot.queryParamMap.has('redirectedFrom');
    let redirectTo: string = '/';

    if(isRedirected)
      redirectTo += this.route.snapshot.queryParamMap.get('redirectedFrom');

    await this.router.navigateByUrl(redirectTo);
  }
}
