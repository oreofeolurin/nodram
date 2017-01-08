"use strict";
const rxjs_1 = require("rxjs");
const spinner = require("../../../helpers/spinner");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const child_process_1 = require("child_process");
const Utils_1 = require("../../../helpers/Utils");
const prod_app_task_1 = require("./prod.app-task");
class ProdAotAppTask extends prod_app_task_1.ProdAppTask {
    constructor(ROOT_DIR) {
        super(ROOT_DIR);
    }
    runNgc() {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Compiling app...');
            child_process_1.exec('node_modules\\.bin\\ngc -p tsconfig.aot.json', { cwd: process.cwd(), maxBuffer: 1024 * 1000 }, (err, stdout, stderr) => {
                /* if (err) return observer.error(err);*/
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled App: ${Utils_1.Utils.timeHuman(time)}`)}`);
                return observer.complete();
            });
        });
    }
    runWebpack() {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Bundling aot app...');
            child_process_1.exec('node_modules\\.bin\\webpack --config webpack.prod.config.ts', { cwd: process.cwd(), maxBuffer: 1024 * 1000 }, (err, stdout, stderr) => {
                /* if (err) return observer.error(err);
                observer.next(stdout);
                observer.next(stderr);
                */
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Bundled Aot App: ${Utils_1.Utils.timeHuman(time)}`)}`);
                return observer.complete();
            });
        });
    }
    copyFiles() {
        const scriptRootDir = this.config.get("scripts.rootDir");
        const src = path.join(this.ROOT_DIR, "/src/templates/browser.bootstrap.prod-aot.ts");
        const dest = path.join(process.cwd(), scriptRootDir, "browser.bootstrap.ts");
        const src2 = path.join(this.ROOT_DIR, "/src/templates/server.prod-aot.ts");
        const dest2 = path.join(process.cwd(), "/server/server.ts");
        const src3 = path.join(this.ROOT_DIR, "/src/templates/browser.module.prod.ts");
        const dest3 = path.join(process.cwd(), scriptRootDir, "browser.module.ts");
        const src4 = path.join(this.ROOT_DIR, "/src/templates/prod.gitignore");
        const dest4 = path.join(process.cwd(), ".gitignore");
        return new rxjs_1.Observable(observer => {
            try {
                fs.copySync(src, dest);
                fs.copySync(src2, dest2);
                fs.copySync(src3, dest3);
                fs.copySync(src4, dest4);
                observer.complete();
            }
            catch (err) {
                observer.error(err);
            }
        });
    }
}
exports.ProdAotAppTask = ProdAotAppTask;
//# sourceMappingURL=prod.aot.app-task.js.map