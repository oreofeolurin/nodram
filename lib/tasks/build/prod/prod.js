"use strict";
const chalk = require("chalk");
const path = require("path");
const RConfig_1 = require("../../../helpers/RConfig");
const SassBuilder_1 = require("../SassBuilder");
const prod_app_task_1 = require("./prod.app-task");
const UtilsTask_1 = require("../../UtilsTask");
class Builder {
    constructor(ROOT_DIR) {
        this.ROOT_DIR = ROOT_DIR;
        this.mode = "prod";
        this.config = new RConfig_1.RConfig();
    }
    build() {
        console.log(chalk.green(`------------------- APP BUILD(${this.mode}) -----------------------------`));
        const config = this.config;
        const rootDir = config.get("scripts.rootDir");
        let scriptsOutDir = path.join(process.cwd(), config.get("scripts.outDir"));
        let binDir = path.join(process.cwd(), "/bin");
        let ngFactories = path.join(process.cwd(), "**/*.ngfactory.ts");
        let clientFiles = path.join(process.cwd(), rootDir, "/**/*.js");
        let stylesConfig = this.config.get("styles");
        let stylesOutDir = path.join(process.cwd(), stylesConfig.outDir);
        const excludes = config.get("scripts.excludes").map(v => "!" + path.join(process.cwd(), `${rootDir}/${v}`));
        const patterns = [binDir, ngFactories, scriptsOutDir, stylesOutDir, clientFiles].concat(excludes);
        const appBuilder = new prod_app_task_1.ProdAppTask(this.ROOT_DIR);
        const sassBuilder = new SassBuilder_1.SassBuilder();
        return UtilsTask_1.UtilsTask.cleanFiles(patterns)
            .concat(appBuilder.refactorApp())
            .concat(sassBuilder.compileBootstrapSass())
            .concat(appBuilder.runWebpack())
            .concat(appBuilder.minifyBundleFiles());
    }
}
exports.Builder = Builder;
//# sourceMappingURL=prod.js.map