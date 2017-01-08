"use strict";
const rxjs_1 = require("rxjs");
const spinner = require("../../../helpers/spinner");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const _ = require("lodash");
const globby = require("globby");
const UglifyJS = require("uglify-js");
const child_process_1 = require("child_process");
const Utils_1 = require("../../../helpers/Utils");
const RConfig_1 = require("../../../helpers/RConfig");
class ProdAppTask {
    constructor(ROOT_DIR) {
        this.ROOT_DIR = ROOT_DIR;
        this.config = new RConfig_1.RConfig();
    }
    /**
     * Refractor app
     */
    refactorApp() {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Refactoring app...');
            let subscriber = this.generateHTML()
                .concat(this.copyFiles())
                .concat(this.rewriteProcfile())
                .concat(this.removeModuleIdFromComponents());
            subscriber.subscribe(data => { }, err => { observer.error(err); }, () => {
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Refactored App: ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
    runWebpack() {
        let start = new Date();
        return rxjs_1.Observable.create(observer => {
            spinner.start('Bundling app...');
            child_process_1.exec('node_modules\\.bin\\webpack', { cwd: process.cwd(), maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
                if (err)
                    return observer.error(err);
                /* observer.next(stdout);
                 observer.next(stderr);*/
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Bundled App: ${Utils_1.Utils.timeHuman(time)}`)}`);
                return observer.complete();
            });
        });
    }
    generateHTML() {
        const config = this.config;
        const indexHTML = path.join(this.ROOT_DIR, "/src/templates/index.prod.html");
        const content = _.template(fs.readFileSync(indexHTML).toString());
        const dest = path.join(process.cwd(), "/server/views/index.html");
        //get settings
        const staticSite = config.get("staticSite");
        const scriptsArray = config.get("scripts.bundles");
        const scripts = Object.keys(scriptsArray).map(v => `${staticSite}/scripts/bundles/${v}.min.js`);
        const stylesArray = config.get("styles.bundles");
        const styles = Object.keys(stylesArray).map(v => `${staticSite}/styles/bundles/${v}.min.css`);
        styles.push(`${staticSite}/styles/main.css`);
        const title = config.get("indexHTML.title");
        const metas = config.get("indexHTML.metas");
        const favicons = config.get("indexHTML.favicons");
        const scriptsOutDir = config.get("scripts.outDir");
        const clientBundleFile = config.get('scripts.clientBundleFile');
        const clientScriptBundle = `${staticSite}/scripts/${clientBundleFile}`;
        return new rxjs_1.Observable(observer => {
            fs.outputFile(dest, content({
                title: title, metas: metas, favicons: favicons,
                styles: styles, scripts: scripts,
                clientScriptBundle: clientScriptBundle
            }), err => {
                if (err) {
                    observer.error(err);
                }
                observer.complete();
            });
        });
    }
    copyFiles() {
        const scriptRootDir = this.config.get("scripts.rootDir");
        const src = path.join(this.ROOT_DIR, "/src/templates/browser.bootstrap.prod.ts");
        const dest = path.join(process.cwd(), scriptRootDir, "browser.bootstrap.ts");
        const src2 = path.join(this.ROOT_DIR, "/src/templates/server.prod.ts");
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
    rewriteProcfile() {
        return new rxjs_1.Observable(observer => {
            let filename = path.join(process.cwd(), "Procfile");
            fs.writeFile(filename, "web: node bin/server.js", 'utf8', (err) => {
                if (err)
                    return observer.error(err);
                return observer.complete();
            });
        });
    }
    removeModuleIdFromComponents() {
        const rootDir = this.config.get("scripts.rootDir");
        const patterns = `${rootDir}/**/*.component.ts`;
        return new rxjs_1.Observable(observer => {
            let srcFiles = globby.sync(`${rootDir}/**/*.component.ts`);
            srcFiles.forEach(srcFile => {
                let contents = fs.readFileSync(srcFile).toString().split('\n');
                let index = contents.findIndex(line => line.includes('moduleId: module.id'));
                if (index !== -1) {
                    contents.splice(index, 1);
                    fs.writeFileSync(srcFile, contents.join('\n'), 'utf8');
                }
            });
            observer.complete();
        });
    }
    minifyBundleFiles() {
        const srcFiles = this.config.get("scripts.bundles");
        let bundles = Object.keys(srcFiles);
        return new rxjs_1.Observable(observer => {
            spinner.start('Minifying library files...');
            let start = new Date();
            rxjs_1.Observable.from(bundles)
                .map(bundle => {
                let dest = path.join(process.cwd(), `/static/scripts/bundles/${bundle}.min.js`);
                return rxjs_1.Observable.create(ob => this.minifyBundleFile(srcFiles[bundle], dest, ob));
            }).concatAll().subscribe(data => observer.next(data), err => this.handleTaskError(err, observer), () => this.completeTask("Minified Library files", start, observer));
        });
    }
    minifyBundleFile(srcFiles, dest, observer) {
        const result = UglifyJS.minify(srcFiles);
        fs.ensureDir(path.dirname(dest), err => {
            if (err)
                return observer.error(err);
            fs.writeFileSync(dest, result.code, "utf8");
            observer.complete();
        });
    }
    completeTask(message, startDate, observer) {
        spinner.stop();
        let time = new Date().getTime() - startDate.getTime();
        observer.next(`${chalk.green('✔')} ${chalk.blue(`${message}: ${time}ms`)}`);
        observer.complete();
    }
    handleTaskError(message, observer) {
        spinner.stop();
        observer.error(`${chalk.red('✖')} ${chalk.yellow(message)}`);
    }
}
exports.ProdAppTask = ProdAppTask;
//# sourceMappingURL=prod.app-task.js.map