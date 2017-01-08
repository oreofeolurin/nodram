/**
 * Created by EdgeTech on 8/31/2016.
 */
import { NgModule }      from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {TopbarComponent} from "./common/topbar.component";
import {ModalComponent} from "./widgets/modal.component";
import { MaterialModule } from '@angular/material'
import { MdCoreModule} from '@angular/material/core'
import { MdIconModule } from '@angular/material/icon'
import {AppService} from "../services/AppService";
import {RConstants} from "../helpers/RConstants";
import {TransportService} from "../services/TransportService";
import {AgmCoreModule} from "angular2-google-maps/core";
import {AuthHttp} from "../services/AuthHttp";
import {GoogleMapComponent} from "./widgets/google-map.component";


@NgModule({
    imports : [
        CommonModule,RouterModule, ReactiveFormsModule,
        //MaterialModule.forRoot(),
        MdCoreModule.forRoot(),
        MdIconModule.forRoot(),
        //MdCheckboxModule.forRoot(),
        AgmCoreModule.forRoot({apiKey: RConstants.GOOGLE_MAP_API_KEY})
    ],
    declarations: [
        TopbarComponent, ModalComponent, GoogleMapComponent // NavigationComponent,
        ],
    exports : [
        ReactiveFormsModule, CommonModule,
        //MdCoreModule,
       /// MdIconModule,
        //MdCheckboxModule,
        TopbarComponent,ModalComponent, AgmCoreModule, GoogleMapComponent,
      // NavigationComponent,
    ],
    providers : [AuthHttp.provide({tokenName : RConstants.JWT_TOKEN_STORE_KEY}), TransportService, AppService]
})
export class SharedModule { }

