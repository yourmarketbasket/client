import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    if (url.includes('/login') || url.includes('/register') || url.includes('/confirmation') || url.includes('/forgot-password') || url.includes('/reset-password')) {
      if (this.authService.loggedIn()) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    } else {
      if (this.authService.loggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
  
  constructor(private authService: AuthService, private router: Router) { }


  
}
