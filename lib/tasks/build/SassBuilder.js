"use strict";
const RConfig_1 = require("../../helpers/RConfig");
const Utils_1 = require("../../helpers/Utils");
const nodeSass = require("node-sass");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const fs = require("fs-extra");
const chalk = require("chalk");
const globby = require("globby");
const spinner = require("../../helpers/spinner");
const del = require("del");
const rxjs_1 = require("rxjs");
class SassBuilder {
    constructor() {
        this.config = new RConfig_1.RConfig();
    }
    buildApp(path, observer) {
        let newPath = `${path.split(".scss")[0]}.css`;
        nodeSass.render({ file: path, outputStyle: 'compressed' }, (err, result) => {
            if (err) {
                observer.error(err);
                return;
            }
            this.prefixCss(result.css.toString('utf8')).then(prefixedCss => {
                try {
                    fs.writeFileSync(newPath, prefixedCss.css, "utf8");
                    observer.next(`${path} completed`);
                    observer.complete();
                }
                catch (err) {
                    observer.error(err);
                    return;
                }
            });
        });
    }
    buildBootstrap(observer) {
        let styles = this.config.get("styles");
        let bootstrapEntryFile = path.join(process.cwd(), styles.bootstrapDir, styles.bootstrapMainFile);
        let outDir = path.join(process.cwd(), styles.outDir);
        if (!fs.existsSync(bootstrapEntryFile)) {
            return observer.error("Bootstrap Files not found");
        }
        nodeSass.render({ file: bootstrapEntryFile, outputStyle: 'compressed' }, (err, result) => {
            if (err)
                return observer.error(err);
            this.prefixCss(result.css.toString('utf8')).then(prefixedCss => {
                try {
                    let mapFile = outDir + "/main.css.map";
                    let cssFile = outDir + "/main.css";
                    fs.ensureFileSync(mapFile);
                    fs.ensureFileSync(cssFile);
                    fs.writeFileSync(mapFile, prefixedCss.map, "utf8");
                    fs.writeFileSync(cssFile, prefixedCss.css, "utf8");
                    observer.complete();
                }
                catch (err) {
                    return observer.error(err);
                }
            });
        });
    }
    prefixCss(css) {
        let config = this.config;
        let cssFile = path.join(`${config["outDir"]}/${config["cssFile"]}`);
        return new Promise((resolve, reject) => {
            postcss([autoprefixer(config["prefix"]), cssnano]).process(css, { from: cssFile, to: cssFile, map: { inline: false } }).then(result => resolve(result));
        });
    }
    cleanFiles(files) {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Cleaning files...');
            del(files).then(paths => {
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Cleaned Files (css): ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
    compileBootstrapSass() {
        spinner.start('Compiling Bootstrap files...');
        return new rxjs_1.Observable(observer => {
            let start = new Date();
            rxjs_1.Observable.create(ob => this.buildBootstrap(ob))
                .subscribe(data => { }, err => this.handleTaskError(err, observer), () => {
                this.completeTask("Compiled Bootstrap Sass", start, observer);
                observer.complete();
            });
        });
    }
    compileAppSass() {
        spinner.start('Compiling App files...');
        const config = this.config.get("styles");
        return new rxjs_1.Observable(observer => {
            let start = new Date();
            globby(config.appFilesPaths).then(paths => {
                //when no files in in glob
                if (paths.length == 0)
                    return this.handleTaskError(`Sass App Files not found`, observer);
                // call the builder
                rxjs_1.Observable.from(paths)
                    .map(path => rxjs_1.Observable.create(ob => this.buildApp(path, ob))).concatAll()
                    .subscribe(data => {
                }, err => this.handleTaskError(err, observer), () => {
                    this.completeTask("Compiled App Sass", start, observer);
                    observer.complete();
                });
            }).catch(err => this.handleTaskError(err, observer));
        });
    }
    completeTask(message, startDate, observer) {
        spinner.stop();
        let time = new Date().getTime() - startDate.getTime();
        observer.next(`${chalk.green('✔')} ${chalk.blue(`${message}: ${time}ms`)}`);
    }
    handleTaskError(message, observer) {
        spinner.stop();
        observer.next(`${chalk.red('✖')} ${chalk.yellow(message)}`);
    }
}
exports.SassBuilder = SassBuilder;
//# sourceMappingURL=SassBuilder.js.map