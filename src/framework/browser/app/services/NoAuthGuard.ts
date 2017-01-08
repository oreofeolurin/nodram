/**
 * Created by EdgeTech on 8/30/2016.
 */
/**
 * Created by EdgeTech on 8/6/2016.
 */
import {Injectable, Inject}     from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot}    from '@angular/router';
import {AuthService} from "./AuthService";

@Injectable()
export class NoAuthGuard implements CanActivate {

    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(Router) private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authService.isLoggedIn) { return true; }

        // Navigate to the login page
        this.router.navigate(['/dashboard']);

        return false;
    }

}