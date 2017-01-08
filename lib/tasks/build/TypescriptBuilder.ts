import {Observable} from "rxjs";
import * as spinner from '../../helpers/spinner';
import * as del from 'del';
import * as path from 'path';
import * as chalk from 'chalk';
import {Utils} from "../../helpers/Utils";
import {RConfig} from "../../helpers/RConfig";

import * as rollup from 'rollup';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as angular from 'rollup-plugin-angular';
import * as tsr from 'rollup-plugin-typescript';
import * as buble from 'rollup-plugin-buble';
import * as uglify from 'rollup-plugin-uglify';
import {outputFile} from "fs-extra";



export class TypescriptBuilder{
    private config;

    constructor(){
        this.config = new RConfig();

    }

    public cleanFiles(files: Array<string>) {
        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Cleaning files...');

            del(files).then(paths => {
                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files (js): ${Utils.timeHuman(time)}`)}`);
                observer.complete();

            });

        })

    }


    public rollupAngularClient(){
        const scripts = this.config.get("scripts");
        let clientBootstrapFile = path.join(process.cwd(), scripts["rootDir"], scripts["clientBootstrapFile"]);
        let outFile =  path.join(process.cwd(), "main.js");


        spinner.start('Rolling up angular client...');


        return new Observable(observer => {

            let start: Date = new Date();

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
                globals : this.getGlobals()
            });


        })
    }

    private getExternals(){
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

    private getGlobals(){
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
        }, this.config.get("externalPackages"))

    }

}