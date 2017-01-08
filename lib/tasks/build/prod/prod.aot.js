"use strict";
const RConfig_1 = require("../../../helpers/RConfig");
const path = require("path");
const chalk = require("chalk");
const UtilsTask_1 = require("../../UtilsTask");
const SassBuilder_1 = require("../SassBuilder");
const prod_aot_app_task_1 = require("./prod.aot.app-task");
class Builder {
    constructor(ROOT_DIR) {
        this.ROOT_DIR = ROOT_DIR;
        this.mode = "prod-aot";
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
        let distDir = path.join(process.cwd(), "/dist");
        const excludes = config.get("scripts.excludes").map(v => "!" + path.join(process.cwd(), `${rootDir}/${v}`));
        const patterns = [binDir, scriptsOutDir, ngFactories, stylesOutDir, clientFiles].concat(excludes);
        const appBuilder = new prod_aot_app_task_1.ProdAotAppTask(this.ROOT_DIR);
        const sassBuilder = new SassBuilder_1.SassBuilder();
        return UtilsTask_1.UtilsTask.cleanFiles(patterns)
            .concat(appBuilder.runNgc())
            .concat(UtilsTask_1.UtilsTask.cleanFiles([distDir]))
            .concat(appBuilder.refactorApp())
            .concat(sassBuilder.compileBootstrapSass())
            .concat(appBuilder.runWebpack())
            .concat(appBuilder.minifyBundleFiles());
    }
}
exports.Builder = Builder;
//# sourceMappingURL=prod.aot.js.map