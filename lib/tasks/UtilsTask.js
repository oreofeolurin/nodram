"use strict";
const rxjs_1 = require("rxjs");
const spinner = require("../helpers/spinner");
const del = require("del");
const chalk = require("chalk");
const Utils_1 = require("../helpers/Utils");
class UtilsTask {
    static cleanFiles(patterns) {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Cleaning files...');
            del(patterns).then(paths => {
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files : ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
}
exports.UtilsTask = UtilsTask;
//# sourceMappingURL=UtilsTask.js.map