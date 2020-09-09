import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUserRegisterData } from '../../../model/user-register-data';
import { IUserDetail } from '../../../model/user';
import { DatabaseService } from '../../shared/service/database.service';
import { IUserLoginData } from '../../../model/user-login-data';
import { ReplaySubject, Observable } from 'rxjs';
import { IAuthState } from '../../../model/auth-state';
import { map } from 'rxjs/operators';
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
    private route: ActivatedRoute) { 
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
        let userData: IUserDetail = {
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
      // .then(() => this.redirectToOrigin());
  }

  public logout(){
    this.auth.auth.signOut()
      // .then(() => this.redirectToOrigin());
  }

  private async getUserDetail(uid: string){
    let userData: IUserDetail = null;
    let isLogged: boolean = false;

    if(uid){
      userData = await this.dbs.getUser(uid);
      isLogged = true;
    };

    this._authState$.next({isLogged: isLogged, user: userData});
    //yeah... 
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
