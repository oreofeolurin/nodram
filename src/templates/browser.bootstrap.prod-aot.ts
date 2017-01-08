// the polyfills must be the first thing imported
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './helpers/__workaround.browser'; // temporary until 2.1.1 things are patched in Core

// Angular 2
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { MainModuleNgFactory } from './browser.module.ngfactory';


// enable prod for faster renders
enableProdMode();


export const platformRef = platformBrowser();

// on document ready bootstrap Angular 2
export function main() {
    return platformRef.bootstrapModuleFactory(MainModuleNgFactory);
}

// support async tag or hmr
switch (document.readyState) {
    case 'interactive':
    case 'complete':
        main();
        break;
    case 'loading':
    default:
        document.addEventListener('DOMContentLoaded', () => main());
}
