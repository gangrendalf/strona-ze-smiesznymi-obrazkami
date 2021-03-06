import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(private auth: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.auth.authState.pipe(map(authUser => !authUser.isLogged));
  }
  
}
