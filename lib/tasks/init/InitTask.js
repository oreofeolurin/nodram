"use strict";
const rxjs_1 = require("rxjs");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const spinner = require("../../helpers/spinner");
const prompt = require("prompt");
const Utils_1 = require("../../helpers/Utils");
class InitTask {
    constructor(ROOT_DIR) {
        this.ROOT_DIR = ROOT_DIR;
    }
    run() {
        const self = this;
        console.log(chalk.green(`------------------- INIT FRAMEWORK(web) -----------------------------`));
        return this.initApp();
    }
    initApp() {
        let start = new Date();
        return new rxjs_1.Observable(observer => {
            this.promptUser().then(result => {
                spinner.start("Initiating Ream App...");
                this.createPackageJson(result);
                spinner.start("Copying files...");
                this.copyFramework();
                spinner.start("...");
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Initiated the Ream Framework : ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
    promptUser() {
        let defaults = {
            name: path.basename(process.cwd()),
            version: "0.0.1",
            license: "Apache-2.0",
        };
        let schema = [
            { name: "name", description: chalk.blue(`App Name: (${defaults.name})`) },
            { name: "description", description: chalk.blue(`Description: `) },
            { name: "version", description: chalk.blue(`Version: (${defaults.version})`) },
            { name: "license", description: chalk.blue(`License: (${defaults.license})`) }
        ];
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.message = "";
            prompt.delimiter = "";
            prompt.get(schema, function (err, result) {
                for (let key in result) {
                    if (result.hasOwnProperty(key)) {
                        if (defaults.hasOwnProperty(key)) {
                            if (result[key].length == 0)
                                result[key] = defaults[key];
                        }
                        else {
                            if (result[key].length == 0)
                                delete result[key];
                        }
                    }
                }
                return resolve(result);
            });
        });
    }
    /**
     * Get contents of default package json and merge with the packageJson passed
     * Then save as new file in the root folder
     * @param packageJson
     */
    createPackageJson(packageJson) {
        let defaultPackageJson = fs.readJsonSync(path.join(this.ROOT_DIR, '/src/package.json'));
        let mergedPackageJson = Object.assign({}, packageJson, defaultPackageJson);
        const destFileName = path.join(process.cwd(), "package.json");
        fs.writeJSONSync(destFileName, mergedPackageJson);
    }
    /**
     * Copy framework folder
     */
    copyFramework() {
        const destFileName = path.join(process.cwd());
        const srcFileName = path.join(this.ROOT_DIR, "src/framework");
        fs.copySync(srcFileName, destFileName);
    }
}
exports.InitTask = InitTask;
//# sourceMappingURL=InitTask.js.map