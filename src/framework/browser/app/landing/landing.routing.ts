import {RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LandingComponent} from "./landing.component";
import {LoginComponent} from "./login.component";
import {NoAuthGuard} from "../services/NoAuthGuard";
import {IndexComponent} from "./index.component";

export const LANDING_ROUTING: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: LandingComponent,
       children: [
           {path: '', component: IndexComponent, canActivate: [NoAuthGuard]},
           {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
       ]
    }
]);