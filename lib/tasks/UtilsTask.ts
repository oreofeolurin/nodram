
import {Observable} from "rxjs";
import * as spinner from '../helpers/spinner';
import * as del from 'del';
import * as path from 'path';
import * as chalk from 'chalk';
import {Utils} from "../helpers/Utils";


export class UtilsTask{

    public static cleanFiles(patterns: Array<string>) {
            let start = new Date();


            return Observable.create(observer => {
                spinner.start('Cleaning files...');


                del(patterns).then(paths => {
                    let time: number = new Date().getTime() - start.getTime();
                    spinner.stop();
                    observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files : ${Utils.timeHuman(time)}`)}`);
                    observer.complete();

                });

            })

        }

}