import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(private auth: AuthService) { }

  async canActivate(): Promise<boolean> {
    return !(await this.auth.authState.pipe(take(1)).toPromise()).isLogged
  }
  
}
