/**
 * Created by EdgeTech on 8/29/2016.
 */
import {NgModule, Optional, SkipSelf, Inject}  from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../services/AuthService";
import {AuthGuard} from "../services/AuthGuard";
import {GraphService} from "../services/GraphService";

@NgModule({
   providers: [ Title, GraphService, AuthService, AuthGuard]
})
export class CoreModule {

    constructor (@Optional() @SkipSelf() @Inject(CoreModule) parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

}