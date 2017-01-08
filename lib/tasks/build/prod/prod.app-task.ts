import {Observable, Observer} from "rxjs";
import * as spinner from '../../../helpers/spinner';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';
import * as _ from 'lodash';
import * as globby from 'globby';
import * as UglifyJS from 'uglify-js';
import  {exec} from 'child_process';
import {Utils} from "../../../helpers/Utils";
import {RConfig} from "../../../helpers/RConfig";



export class ProdAppTask{
    protected config;

    constructor(protected ROOT_DIR){
        this.config = new RConfig();

    }

    /**
     * Refractor app
     */
    public refactorApp() {
        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Refactoring app...');

            let subscriber = this.generateHTML()
                .concat(this.copyFiles())
                .concat(this.rewriteProcfile())
                .concat(this.removeModuleIdFromComponents());

            subscriber.subscribe(
                data => {},
                err => {observer.error(err)},
                () => {
                    let time: number = new Date().getTime() - start.getTime();
                    spinner.stop();
                    observer.next(`${chalk.green('✔')} ${chalk.blue(`Refactored App: ${Utils.timeHuman(time)}`)}`);
                    observer.complete();
                });

        })
    }

    public runWebpack(){
        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Bundling app...');


            exec('node_modules\\.bin\\webpack', {cwd : process.cwd(), maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
                if (err) return observer.error(err);

               /* observer.next(stdout);
                observer.next(stderr);*/


                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Bundled App: ${Utils.timeHuman(time)}`)}`);

                return observer.complete();
            });

        })



    }

    private generateHTML(){
        const config = this.config;
        const indexHTML = path.join(this.ROOT_DIR,"/src/templates/index.prod.html");
        const content = _.template(fs.readFileSync(indexHTML).toString());
        const dest = path.join(process.cwd(),"/server/views/index.html");

        //get settings
        const staticSite = config.get("staticSite");
        const scriptsArray = config.get("scripts.bundles");
        const scripts = Object.keys(scriptsArray).map(v => `${staticSite}/scripts/bundles/${v}.min.js`);

        const stylesArray = config.get("styles.bundles");
        const styles = Object.keys(stylesArray).map(v => `${staticSite}/styles/bundles/${v}.min.css`);
        styles.push(`${staticSite}/styles/main.css`);

        const title = config.get("indexHTML.title");
        const metas = config.get("indexHTML.metas");
        const favicons = config.get("indexHTML.favicons");
        const scriptsOutDir = config.get("scripts.outDir");
        const clientBundleFile = config.get('scripts.clientBundleFile');
        const clientScriptBundle = `${staticSite}/scripts/${clientBundleFile}`;


        return new Observable(observer => {
            fs.outputFile(dest, content({
                title: title, metas: metas, favicons : favicons,
                styles : styles, scripts: scripts,
                clientScriptBundle : clientScriptBundle
            }), err => {
                if (err) {
                    observer.error(err);
                }
                observer.complete();
            });
        });

    }


    public copyFiles(){

        const scriptRootDir= this.config.get("scripts.rootDir");
        const src = path.join(this.ROOT_DIR,"/src/templates/browser.bootstrap.prod.ts");
        const dest = path.join(process.cwd(),scriptRootDir,"browser.bootstrap.ts");

        const src2 = path.join(this.ROOT_DIR,"/src/templates/server.prod.ts");
        const dest2 = path.join(process.cwd(),"/server/server.ts");

        const src3 = path.join(this.ROOT_DIR,"/src/templates/browser.module.prod.ts");
        const dest3 = path.join(process.cwd(),scriptRootDir,"browser.module.ts");

        const src4 = path.join(this.ROOT_DIR,"/src/templates/prod.gitignore");
        const dest4 = path.join(process.cwd(),".gitignore");


        return new Observable(observer => {
            try {
                fs.copySync(src, dest);
                fs.copySync(src2, dest2);
                fs.copySync(src3, dest3);
                fs.copySync(src4, dest4);
                observer.complete();

            }catch(err){observer.error(err);}

        });

    }

    private rewriteProcfile(){
        return new Observable(observer => {
            let filename = path.join(process.cwd(),"Procfile");
            fs.writeFile(filename,"web: node bin/server.js",'utf8',(err) =>{
                if(err) return observer.error(err);
                return observer.complete();
            })
        });

    }


    private removeModuleIdFromComponents(): Observable<any> {
        const rootDir = this.config.get("scripts.rootDir");
        const patterns = `${rootDir}/**/*.component.ts`;

        return new Observable(observer => {
            let srcFiles = globby.sync(`${rootDir}/**/*.component.ts`);
            srcFiles.forEach(srcFile => {
                let contents = fs.readFileSync(srcFile).toString().split('\n');
                let index = contents.findIndex(line => line.includes('moduleId: module.id'));
                if (index !== -1) {
                    contents.splice(index, 1);
                    fs.writeFileSync(srcFile, contents.join('\n'), 'utf8');
                }
            });

            observer.complete();
        });
    }




    public minifyBundleFiles(){

        const srcFiles = this.config.get("scripts.bundles");
        let bundles = Object.keys(srcFiles);

        return new Observable(observer => {

            spinner.start('Minifying library files...');
            let start: Date = new Date();

            Observable.from(bundles)
                .map(bundle => {
                    let dest = path.join(process.cwd(), `/static/scripts/bundles/${bundle}.min.js`);
                    return Observable.create(ob => this.minifyBundleFile(srcFiles[bundle], dest, ob))
                }).concatAll().subscribe(
                data => observer.next(data),
                err => this.handleTaskError(err, observer),
                () => this.completeTask("Minified Library files", start, observer)
            );
        });

    }

    private minifyBundleFile(srcFiles: string[], dest: string, observer: Observer<string>){

        const result = UglifyJS.minify(srcFiles);
        fs.ensureDir(path.dirname(dest), err => {
            if(err) return observer.error(err);

            fs.writeFileSync(dest, result.code, "utf8");
            observer.complete();
        });

    }



    private completeTask(message: string, startDate: Date, observer: Observer<string>){
        spinner.stop();
        let time: number = new Date().getTime() - startDate.getTime();
        observer.next(`${chalk.green('✔')} ${chalk.blue(`${message}: ${time}ms`)}`);
        observer.complete();

    }

    private handleTaskError(message: string, observer: Observer<string>){
        spinner.stop();
        observer.error(`${chalk.red('✖')} ${chalk.yellow(message)}`);
    }



}