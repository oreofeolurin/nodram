"use strict";
const chalk = require("chalk");
const path = require("path");
const RConfig_1 = require("../../../helpers/RConfig");
const SassBuilder_1 = require("../SassBuilder");
const app_task_1 = require("./app-task");
const UtilsTask_1 = require("../../UtilsTask");
class Builder {
    constructor(ROOT_DIR) {
        this.ROOT_DIR = ROOT_DIR;
        this.mode = "dev";
        this.config = new RConfig_1.RConfig();
    }
    build() {
        console.log(chalk.green(`------------------- APP BUILD(${this.mode}) -----------------------------`));
        const config = this.config;
        const rootDir = config.get("scripts.rootDir");
        let scriptsOutDir = path.join(process.cwd(), config.get("scripts.outDir"));
        let binDir = path.join(process.cwd(), "/bin");
        let ngFactories = path.join(process.cwd(), rootDir, "/**/*.ngfactory.ts");
        let stylesOutDir = path.join(process.cwd(), config.get("styles.outDir"));
        let serverFiles = path.join(process.cwd(), "./server/**/*.js");
        const excludes = config.get("scripts.excludes").map(v => "!" + path.join(process.cwd(), `${rootDir}/${v}`));
        const patterns = [binDir, stylesOutDir, scriptsOutDir, ngFactories, serverFiles].concat(excludes);
        const appBuilder = new app_task_1.AppTask(this.ROOT_DIR);
        const sassBuilder = new SassBuilder_1.SassBuilder();
        return UtilsTask_1.UtilsTask.cleanFiles(patterns)
            .concat(appBuilder.refactorApp())
            .concat(sassBuilder.compileBootstrapSass())
            .concat(sassBuilder.compileAppSass())
            .concat(appBuilder.compileAppTypescript())
            .concat(appBuilder.minifyBundleFiles())
            .concat(appBuilder.buildSystemJSBundleFiles());
    }
}
exports.Builder = Builder;
//# sourceMappingURL=dev.js.map