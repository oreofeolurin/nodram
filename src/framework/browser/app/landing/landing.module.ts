/**
 * Created by EdgeTech on 7/6/2016.
 */
import {NgModule}           from '@angular/core';
import {LANDING_ROUTING} from "./landing.routing";
import {LoginComponent} from "./login.component";
import {LandingComponent} from "./landing.component";
import {NoAuthGuard} from "../services/NoAuthGuard";
import {SharedModule} from "../shared/shared.module";
import {IndexComponent} from "./index.component";


@NgModule({
  imports:      [SharedModule, LANDING_ROUTING],
  declarations: [LandingComponent, IndexComponent, LoginComponent],
  providers : [NoAuthGuard]
})

export class LandingModule { }
