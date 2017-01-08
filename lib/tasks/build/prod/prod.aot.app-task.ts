import {Observable} from "rxjs";
import * as spinner from '../../../helpers/spinner';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';
import  {exec} from 'child_process';
import {Utils} from "../../../helpers/Utils";
import {ProdAppTask} from "./prod.app-task";



export class ProdAotAppTask extends ProdAppTask{

    constructor(ROOT_DIR: string){
        super(ROOT_DIR);
    }


    public runNgc(){

        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Compiling app...');

            exec('node_modules\\.bin\\ngc -p tsconfig.aot.json', {cwd : process.cwd(), maxBuffer: 1024 * 1000}, (err, stdout, stderr) => {

               /* if (err) return observer.error(err);*/
                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled App: ${Utils.timeHuman(time)}`)}`);

                return observer.complete();
            });

        })


    }


    public runWebpack(){
        let start = new Date();

        return Observable.create(observer => {
            spinner.start('Bundling aot app...');


            exec('node_modules\\.bin\\webpack --config webpack.prod.config.ts', {cwd : process.cwd(), maxBuffer: 1024 * 1000}, (err, stdout, stderr) => {

                /* if (err) return observer.error(err);
                observer.next(stdout);
                observer.next(stderr);
                */

                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Bundled Aot App: ${Utils.timeHuman(time)}`)}`);

                return observer.complete();
            });

        })



    }

    public copyFiles(){

        const scriptRootDir= this.config.get("scripts.rootDir");
        const src = path.join(this.ROOT_DIR,"/src/templates/browser.bootstrap.prod-aot.ts");
        const dest = path.join(process.cwd(),scriptRootDir,"browser.bootstrap.ts");

        const src2 = path.join(this.ROOT_DIR,"/src/templates/server.prod-aot.ts");
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



}