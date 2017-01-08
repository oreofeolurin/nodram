/**
 * Created by EdgeTech on 9/7/2016.
 */
import {Injectable, Inject}     from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot}    from '@angular/router';
import {AuthService} from "./AuthService";
import {AppService} from "./AppService";

@Injectable()
export class SuperAdminGuard implements CanActivate {

    constructor(@Inject(AppService) private appService: AppService,
        @Inject(Router) private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.appService.getAdmin().isSuper) { return true; }

        // Navigate to the login page
        this.router.navigate(['/dashboard']);

        return false;
    }

}