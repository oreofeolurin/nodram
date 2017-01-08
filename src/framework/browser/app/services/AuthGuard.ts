/**
 * Created by EdgeTech on 8/6/2016.
 */
import {Injectable, Inject}     from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot}    from '@angular/router';
import {AuthService} from "./AuthService";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(@Inject(AuthService) private authService: AuthService,
              @Inject(Router) private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = state.url;

    // Navigate to the login page
    this.router.navigate(['/']);

    return false;
  }

}