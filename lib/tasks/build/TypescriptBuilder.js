"use strict";
const rxjs_1 = require("rxjs");
const spinner = require("../../helpers/spinner");
const del = require("del");
const path = require("path");
const chalk = require("chalk");
const Utils_1 = require("../../helpers/Utils");
const RConfig_1 = require("../../helpers/RConfig");
const rollup = require("rollup");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const tsr = require("rollup-plugin-typescript");
const buble = require("rollup-plugin-buble");
class TypescriptBuilder {
    constructor() {
        this.config = new RConfig_1.RConfig();
    }
    cleanFiles(files) {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Cleaning files...');
            del(files).then(paths => {
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files (js): ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
    rollupAngularClient() {
        const scripts = this.config.get("scripts");
        let clientBootstrapFile = path.join(process.cwd(), scripts["rootDir"], scripts["clientBootstrapFile"]);
        let outFile = path.join(process.cwd(), "main.js");
        spinner.start('Rolling up angular client...');
        return new rxjs_1.Observable(observer => {
            let start = new Date();
            //noinspection TypeScriptUnresolvedFunction
            rollup.rollup({
                entry: clientBootstrapFile,
                dest: outFile,
                //sourceMap: false,
                //format: 'iife',
                //cache: this.cache,
                //context: 'this',
                external: this.getExternals(),
                plugins: [
                    /* angular({
                     preprocessors: {
                         style: src => {
                             return sass.renderSync({ data: src, indentedSyntax: true, outputStyle: 'compressed' }).css;
                         }
                     }
                 }),*/
                    tsr({
                        typescript: require('typescript')
                    }),
                    commonjs(),
                    nodeResolve({ jsnext: true, main: true, browser: true }),
                    buble()
                ],
                globals: this.getGlobals()
            });
        });
    }
    getExternals() {
        return [
            '@angular/core',
            '@angular/common',
            '@angular/platform-browser-dynamic',
            '@angular/platform-browser',
            '@angular/forms',
            '@angular/http',
            '@angular/router',
            'angular2-universal/browser'
        ].concat(Object.keys(this.config.get("externalPackages")));
    }
    getGlobals() {
        //noinspection TypeScriptUnresolvedFunction
        return Object.assign({
            '@angular/core': 'vendor._angular_core',
            '@angular/common': 'vendor._angular_common',
            '@angular/platform-browser': 'vendor._angular_platformBrowser',
            '@angular/platform-browser-dynamic': 'vendor._angular_platformBrowserDynamic',
            'angular2-universal/browser': 'vendor._angular2_universal_browser',
            '@angular/router': 'vendor._angular_router',
            '@angular/http': 'vendor._angular_http',
            '@angular/forms': 'vendor._angular_forms'
        }, this.config.get("externalPackages"));
    }
}
exports.TypescriptBuilder = TypescriptBuilder;
//# sourceMappingURL=TypescriptBuilder.js.map