import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private auth: AuthService, private router: Router) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    
    return await this.auth.authState$
      .pipe(
        take(1),
        map(state => {
          if(!state.isLogged){
            const redirectedFrom: string = next.url.toString();
            const redirectTo: string = '/login';

            this.router.navigate([redirectTo], {queryParams: {redirectedFrom: redirectedFrom}});
          }

          return state.isLogged;
        })
      )
      .toPromise();
  }
  
}
