
import {Observable} from "rxjs";
import * as chalk from 'chalk';
import * as chokidar from 'chokidar';
import {RConfig} from "../../helpers/RConfig";
import {SassBuilder} from "../build/SassBuilder";
import * as spinner from '../../helpers/spinner';
import {Utils} from "../../helpers/Utils";

export class SassWatcher {
    private config;

    constructor(){

        this.config = new RConfig();

    }

    public watch(): Observable<any> {
        const styleConfig = this.config.get("styles");
        const sassBuilder = new SassBuilder();


        let appFiles = styleConfig.appFilesPaths;
        let appFilesWatcher = chokidar.watch(appFiles,{
            persistent: true,
        });


        let bootstrapFiles = styleConfig.bootstrapFilesPaths;
        let bootstrapFilesWatcher = chokidar.watch(bootstrapFiles,{
            persistent: true,
        });

        return new Observable(observer => {

            appFilesWatcher.on("change", path => {

                 spinner.start(`Compiling ${path}...`);
                 let start = new Date();

                 Observable.create( ob => sassBuilder.buildApp(path,ob))
                     .subscribe(data => {}, err => observer.error(err), () => completed() );

                 function completed(){
                     spinner.stop();
                     let time: number = new Date().getTime() - start.getTime();
                     spinner.stop();
                     observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled sass file (${path}): ${Utils.timeHuman(time)}`)}`);
                 }

             });


            bootstrapFilesWatcher.on("change", path => {

                spinner.start(`Compiling bootstrap files`);
                let start = new Date();

                Observable.create( ob => sassBuilder.buildBootstrap(ob))
                    .subscribe(data => {}, err => observer.error(err), () => completed() );

                function completed(){
                    spinner.stop();
                    let time: number = new Date().getTime() - start.getTime();
                    spinner.stop();
                    observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled bootstrap files: ${Utils.timeHuman(time)}`)}`);
                }

            })

         });
     }
}