/**
 * Created by EdgeTech on 8/29/2016.
 */
/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */

    declare const SystemJS: any;

    // map tells the System loader where to look for things
    let map = {
        'app':                        'app', // 'dist',
        '@angular':                   'node_modules/@angular',
        'rxjs':                       'node_modules/rxjs',
        'angular2-google-maps/core':  'node_modules/angular2-google-maps'

    };
    // packages tells the System loader how to load when no filename and/or no extension
    let packages = {
        'app':                        { main: 'browser.bootstrap.js',   defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-google-maps/core':  { defaultExtension: 'js', main: "core/core.umd.js"},
        'angular2-universal/browser':         { defaultExtension: 'js', main: "index.js"},
        '@angular/material': { format: 'cjs', main: 'material.umd.js'}

    };
    let ngPackageNames = [
        'common', 'compiler', 'core', 'forms', 'http',
        'platform-browser', 'platform-browser-dynamic', 'router', 'upgrade'
    ];

    let bundles = {
        "rxjs-bundle": [
            "rxjs/util/*", "rxjs/add/observable/*", "rxjs/observable/*", "rxjs/add/operator/*", "rxjs/operator/*", "rxjs/testing/*",
            "rxjs/*"
        ],
        //"app-libs-bundle" : ["immutable/dist/*"],
        "app-core-bundle": [
            "app/*.js", "app/core/*", "app/helpers/*", "app/services/*", "app/shared/*",
            "app/models/*", "app/animations/*"
        ],
        //"app-landing-bundle": ["app/landing/!*"]
    };

    let paths = {
        "rxjs-bundle": 'scripts/bundles/rxjs.min.js',
        "app-libs-bundle": 'scripts/bundles/app-libs.min.js',
        "app-core-bundle": 'scripts/bundles/app-core.min.js',
        "app-landing-bundle": 'scripts/bundles/app-landing.min.js',
    };


    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        let bundleFile = 'bundles/' + pkgName + '.umd.js';

        if(pkgName === 'material') bundleFile = pkgName + '.umd.js';

        packages['@angular/'+pkgName] = { main: bundleFile , defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
   // let setPackageConfig = SystemJS["packageWithIndex"] ? packIndex : packUmd;
    // Add package entries for angular packages

    ngPackageNames.forEach(packUmd);

    SystemJS.config({
        map: map,
        packages: packages,
        bundles : bundles,
        paths : paths
    });