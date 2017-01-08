
import * as chalk from 'chalk';
import {SassWatcher} from "./SassWatcher";
import {TypescriptWatch} from "./TypescriptWatch";


export class WatchTask{


    public watch(){

        console.log(chalk.green(`------------------- REAM APP WATCH ----------------------------------`));
        console.log(chalk.blue('watching...'));

        const sassWatch = new SassWatcher();
        const typescriptWatch = new TypescriptWatch();

        return sassWatch.watch().merge(typescriptWatch.watch());
    }


}