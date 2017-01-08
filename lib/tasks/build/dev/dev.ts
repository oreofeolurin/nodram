import {Observable} from 'rxjs';
import * as chalk from 'chalk';
import * as path from "path";
import {RConfig} from "../../../helpers/RConfig";
import {SassBuilder} from "../SassBuilder";
import {AppTask} from "./app-task";
import {UtilsTask} from "../../UtilsTask";

export class Builder {
    private mode: string = "dev";
    protected config: RConfig;

    constructor(private ROOT_DIR: string) {
        this.config = new RConfig();
    }


    public build(): Observable<any> {

        console.log(chalk.green(`------------------- APP BUILD(${this.mode}) -----------------------------`));

        const config = this.config;
        const rootDir = config.get("scripts.rootDir");

        let scriptsOutDir = path.join(process.cwd(), config.get("scripts.outDir"));
        let binDir  = path.join(process.cwd(), "/bin");
        let ngFactories  = path.join(process.cwd(),rootDir,"/**/*.ngfactory.ts");
        let stylesOutDir = path.join(process.cwd(), config.get("styles.outDir"));
        let serverFiles =  path.join(process.cwd(),"./server/**/*.js");

        const excludes = config.get("scripts.excludes").map(v => "!"+path.join(process.cwd(),`${rootDir}/${v}`));

        const patterns = [binDir, stylesOutDir, scriptsOutDir, ngFactories, serverFiles].concat(excludes);

        const appBuilder = new AppTask(this.ROOT_DIR);
        const sassBuilder = new SassBuilder();

        return UtilsTask.cleanFiles(patterns)
            .concat(appBuilder.refactorApp())
            .concat(sassBuilder.compileBootstrapSass())
            .concat(sassBuilder.compileAppSass())
            .concat(appBuilder.compileAppTypescript())
            .concat(appBuilder.minifyBundleFiles())
            .concat(appBuilder.buildSystemJSBundleFiles());

    }


}