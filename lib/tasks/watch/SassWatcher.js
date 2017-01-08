"use strict";
const rxjs_1 = require("rxjs");
const chalk = require("chalk");
const chokidar = require("chokidar");
const RConfig_1 = require("../../helpers/RConfig");
const SassBuilder_1 = require("../build/SassBuilder");
const spinner = require("../../helpers/spinner");
const Utils_1 = require("../../helpers/Utils");
class SassWatcher {
    constructor() {
        this.config = new RConfig_1.RConfig();
    }
    watch() {
        const styleConfig = this.config.get("styles");
        const sassBuilder = new SassBuilder_1.SassBuilder();
        let appFiles = styleConfig.appFilesPaths;
        let appFilesWatcher = chokidar.watch(appFiles, {
            persistent: true,
        });
        let bootstrapFiles = styleConfig.bootstrapFilesPaths;
        let bootstrapFilesWatcher = chokidar.watch(bootstrapFiles, {
            persistent: true,
        });
        return new rxjs_1.Observable(observer => {
            appFilesWatcher.on("change", path => {
                spinner.start(`Compiling ${path}...`);
                let start = new Date();
                rxjs_1.Observable.create(ob => sassBuilder.buildApp(path, ob))
                    .subscribe(data => { }, err => observer.error(err), () => completed());
                function completed() {
                    spinner.stop();
                    let time = new Date().getTime() - start.getTime();
                    spinner.stop();
                    observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled sass file (${path}): ${Utils_1.Utils.timeHuman(time)}`)}`);
                }
            });
            bootstrapFilesWatcher.on("change", path => {
                spinner.start(`Compiling bootstrap files`);
                let start = new Date();
                rxjs_1.Observable.create(ob => sassBuilder.buildBootstrap(ob))
                    .subscribe(data => { }, err => observer.error(err), () => completed());
                function completed() {
                    spinner.stop();
                    let time = new Date().getTime() - start.getTime();
                    spinner.stop();
                    observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled bootstrap files: ${Utils_1.Utils.timeHuman(time)}`)}`);
                }
            });
        });
    }
}
exports.SassWatcher = SassWatcher;
//# sourceMappingURL=SassWatcher.js.map