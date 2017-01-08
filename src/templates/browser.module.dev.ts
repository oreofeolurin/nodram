import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {AppModule} from "./app.module";

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        FormsModule,
        BrowserModule,
        HttpModule,
        AppModule,
    ]
})

export class MainModule {}
