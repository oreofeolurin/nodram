/**
 * Created by EdgeTech on 8/29/2016.
 */
import { NgModule }      from '@angular/core';
import { AppComponent }  from './app.component';
import {CoreModule} from "./core/core.module";
import {APP_ROUTING} from "./app.routing";
import {LandingModule} from "./landing/landing.module";

@NgModule({
    imports:      [LandingModule,  CoreModule, APP_ROUTING],
    declarations: [ AppComponent]
})
export class AppModule { }
