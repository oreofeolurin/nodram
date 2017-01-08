import {RConfig} from "../../helpers/RConfig";
import {Utils} from "../../helpers/Utils";
import * as nodeSass from "node-sass";
import * as path from "path";
import * as postcss from "postcss";
import * as cssnano from "cssnano";
import * as autoprefixer from "autoprefixer";
import * as fs from "fs-extra";
import * as chalk from 'chalk';
import * as globby from 'globby';
import * as spinner from '../../helpers/spinner';
import * as del from 'del';
import {Observable, Observer} from "rxjs";

export class SassBuilder{
    private config;

    constructor(){
        this.config = new RConfig();

    }

    public buildApp(path, observer: Observer<string>){
        let newPath = `${path.split(".scss")[0]}.css`;

        nodeSass.render({file: path, outputStyle: 'compressed'}, (err, result) => {
            if (err) {
                observer.error(err);
                return;
            }

            this.prefixCss(result.css.toString('utf8')).then( prefixedCss => {
                try {
                    fs.writeFileSync(newPath, prefixedCss.css, "utf8");
                    observer.next(`${path} completed`);
                    observer.complete();

                }catch(err) {
                    observer.error(err);
                    return;
                }

            });

        });
    }


    public buildBootstrap(observer: Observer<string>){
        let styles =  this.config.get("styles");
        let bootstrapEntryFile = path.join(process.cwd(),styles.bootstrapDir,styles.bootstrapMainFile);
        let outDir = path.join(process.cwd(),styles.outDir);


        if (!fs.existsSync(bootstrapEntryFile)) {
            return observer.error("Bootstrap Files not found");
        }

        nodeSass.render({file: bootstrapEntryFile, outputStyle: 'compressed'}, (err, result) => {
            if (err) return observer.error(err);

            this.prefixCss(result.css.toString('utf8')).then( prefixedCss => {

                try {
                    let mapFile =  outDir + "/main.css.map";
                    let cssFile =  outDir + "/main.css";
                    fs.ensureFileSync(mapFile);
                    fs.ensureFileSync(cssFile);
                    fs.writeFileSync(mapFile, prefixedCss.map, "utf8");
                    fs.writeFileSync(cssFile, prefixedCss.css, "utf8");

                    observer.complete();

                }catch(err) {
                    return observer.error(err);
                }

            });

        });


    }


    private prefixCss(css: string):Promise<any>{
        let config = this.config;
        let cssFile = path.join(`${config["outDir"]}/${config["cssFile"]}`);

        return new Promise( (resolve,reject) => {
            postcss([autoprefixer(config["prefix"]),cssnano]).process(css,{from : cssFile, to : cssFile, map: { inline: false }}).then(result => resolve(result));
        });

    }



    public cleanFiles(files: Array<string>) {
        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Cleaning files...');

            del(files).then(paths => {
                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files (css): ${Utils.timeHuman(time)}`)}`);
                observer.complete();

            });

        })

    }


    public compileBootstrapSass() {

        spinner.start('Compiling Bootstrap files...');

        return new Observable(observer => {

            let start: Date = new Date();

            Observable.create(ob => this.buildBootstrap(ob))
                .subscribe(data => {},
                    err => this.handleTaskError(err,observer),
                    ()=> {
                        this.completeTask("Compiled Bootstrap Sass",start,observer);
                        observer.complete();
                    })
        })
    }

    public compileAppSass() {
        spinner.start('Compiling App files...');

        const config = this.config.get("styles");

        return new Observable(observer => {

            let start: Date = new Date();

            globby(config.appFilesPaths).then(paths => {
                //when no files in in glob
                if (paths.length == 0) return this.handleTaskError(`Sass App Files not found`, observer);

                // call the builder
                Observable.from(paths)
                    .map(path => Observable.create(ob => this.buildApp(path, ob))).concatAll()
                    .subscribe(data => {
                        },
                        err => this.handleTaskError(err, observer),
                        () => {
                            this.completeTask("Compiled App Sass", start, observer);
                            observer.complete();
                        });


            }).catch(err => this.handleTaskError(err, observer));

        })

    }


    private completeTask(message: string, startDate: Date, observer: Observer<string>){
        spinner.stop();
        let time: number = new Date().getTime() - startDate.getTime();
        observer.next(`${chalk.green('✔')} ${chalk.blue(`${message}: ${time}ms`)}`);

    }

    private handleTaskError(message: string, observer: Observer<string>){
        spinner.stop();
        observer.next(`${chalk.red('✖')} ${chalk.yellow(message)}`);

    }

}