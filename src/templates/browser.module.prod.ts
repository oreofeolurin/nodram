import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule, isBrowser, isNode, AUTO_PREBOOT } from 'angular2-universal/browser';
import {AppComponent} from "./app.component";
import {AppModule} from "./app.module";
import { Meta } from './helpers/angular2-meta';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        UniversalModule,
        FormsModule,
        RouterModule.forRoot([], { useHash: false }),
        AppModule,
    ],
    providers: [
        { provide: 'isBrowser', useValue: isBrowser },
        { provide: 'isNode', useValue: isNode },
        Meta
    ]
})
export class MainModule {}
