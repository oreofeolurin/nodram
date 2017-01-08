import {Observable} from 'rxjs';
import * as chalk from 'chalk';
import * as path from "path";
import {RConfig} from "../../../helpers/RConfig";
import {SassBuilder} from "../SassBuilder";
import {ProdAppTask as AppTask} from "./prod.app-task";
import {UtilsTask} from "../../UtilsTask";

export class Builder {
    private mode: string = "prod";
    protected config: RConfig;

    constructor(private ROOT_DIR) {
        this.config = new RConfig();
    }


    public build(): Observable<any> {

        console.log(chalk.green(`------------------- APP BUILD(${this.mode}) -----------------------------`));

        const config = this.config;
        const rootDir = config.get("scripts.rootDir");
        let scriptsOutDir = path.join(process.cwd(), config.get("scripts.outDir"));
        let binDir  = path.join(process.cwd(), "/bin");
        let ngFactories  = path.join(process.cwd(),"**/*.ngfactory.ts");
        let clientFiles =  path.join(process.cwd(),rootDir,"/**/*.js");

        let stylesConfig = this.config.get("styles");
        let stylesOutDir = path.join(process.cwd(), stylesConfig.outDir);


        const excludes = config.get("scripts.excludes").map(v => "!"+path.join(process.cwd(),`${rootDir}/${v}`));
        const patterns = [binDir, ngFactories, scriptsOutDir, stylesOutDir, clientFiles].concat(excludes);


        const appBuilder = new AppTask(this.ROOT_DIR);
        const sassBuilder = new SassBuilder();

        return UtilsTask.cleanFiles(patterns)
            .concat(appBuilder.refactorApp())
            .concat(sassBuilder.compileBootstrapSass())
            .concat(appBuilder.runWebpack())
            .concat(appBuilder.minifyBundleFiles());
    }


}