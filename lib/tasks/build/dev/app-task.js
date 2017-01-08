"use strict";
const rxjs_1 = require("rxjs");
const spinner = require("../../../helpers/spinner");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const _ = require("lodash");
const globby = require("globby");
const ts = require("typescript");
const UglifyJS = require("uglify-js");
const SystemBuilder = require("systemjs-builder");
const Utils_1 = require("../../../helpers/Utils");
const RConfig_1 = require("../../../helpers/RConfig");
class AppTask {
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
                .concat(this.addModuleIdToComponents());
            subscriber.subscribe(data => { }, err => { observer.error(err); }, () => {
                let time = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Refactored App: ${Utils_1.Utils.timeHuman(time)}`)}`);
                observer.complete();
            });
        });
    }
    /**
     * Get the list of all TS Files
     * Set Config for typescript
     * Compile the files
     * @returns {Observable}
     */
    compileAppTypescript() {
        const config = this.config;
        const rootDir = config.get("scripts.rootDir");
        const patterns = config.get("scripts.excludes").map(v => `!${rootDir}/${v}`);
        patterns.unshift(rootDir + "/**/*.ts");
        patterns.push("./server/**/*.ts");
        patterns.push("!./server/node.module.ts");
        const tsOptions = config.get("scripts.compilerOptions");
        return new rxjs_1.Observable(observer => {
            spinner.start('Compiling app files...');
            let start = new Date();
            const paths = globby.sync(patterns);
            this.compileTypescript(paths, tsOptions)
                .subscribe(data => observer.next(data), err => this.handleTaskError(err, observer), () => this.completeTask("Compiled App files", start, observer));
        });
    }
    generateHTML() {
        const indexHTML = path.join(this.ROOT_DIR, "/src/templates/index.dev.html");
        const content = _.template(fs.readFileSync(indexHTML).toString());
        const dest = path.join(process.cwd(), "/server/views/index.html");
        //get settings
        const scriptsArray = this.config.get("scripts.bundles");
        const scripts = Object.keys(scriptsArray).map(v => `./scripts/bundles/${v}.min.js`);
        const stylesArray = this.config.get("styles.bundles");
        const indexStyles = this.config.get("indexHTML.styles");
        let styles = Object.keys(stylesArray).map(v => `./styles/bundles/${v}.min.css`);
        styles.unshift(`./styles/main.css`);
        styles = styles.concat(indexStyles);
        const title = this.config.get("indexHTML.title");
        const metas = this.config.get("indexHTML.metas");
        const favicons = this.config.get("indexHTML.favicons");
        return new rxjs_1.Observable(observer => {
            fs.outputFile(dest, content({ title: title, metas: metas, favicons: favicons, styles: styles, scripts: scripts }), err => {
                if (err) {
                    observer.error(err);
                }
                observer.complete();
            });
        });
    }
    minifyBundleFiles() {
        let srcFiles = this.config.get("scripts.bundles");
        //set required libs
        srcFiles["dev-libs"] = [
            "node_modules/core-js/client/core.min.js",
            "node_modules/zone.js/dist/zone.min.js",
            "node_modules/systemjs/dist/system.js"
        ];
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
    buildSystemJSBundleFiles() {
        const srcFiles = this.config.get("scripts.systemjs-bundles");
        let bundles = Object.keys(srcFiles);
        return new rxjs_1.Observable(observer => {
            spinner.start('Building SystemJS library files...');
            let start = new Date();
            rxjs_1.Observable.from(bundles)
                .map(bundle => {
                let dest = path.join(process.cwd(), `/static/scripts/bundles/${bundle}.min.js`);
                return rxjs_1.Observable.create(ob => this.bundleSystemJSFile(srcFiles[bundle], dest, ob));
            }).concatAll().subscribe(data => observer.next(data), err => this.handleTaskError(err, observer), () => this.completeTask("Builded SystemJS files", start, observer));
        });
    }
    bundleSystemJSFile(patterns, dest, observer) {
        let srcFiles = globby.sync(patterns);
        let root = "./";
        if (dest.includes("app-")) {
            root = './browser';
            srcFiles = srcFiles.map(v => v.replace(/browser\//, ''));
        }
        const builder = new SystemBuilder(root, path.join(process.cwd(), '/browser/app/systemjs.config.js'));
        builder.bundle(srcFiles, dest, { minify: true })
            .then(() => observer.complete())
            .catch(err => observer.error(err));
    }
    copyFiles() {
        const scriptRootDir = this.config.get("scripts.rootDir");
        const src = path.join(this.ROOT_DIR, "/src/templates/browser.bootstrap.dev.ts");
        const dest = path.join(process.cwd(), scriptRootDir, "browser.bootstrap.ts");
        const src2 = path.join(this.ROOT_DIR, "/src/templates/server.dev.ts");
        const dest2 = path.join(process.cwd(), "/server/server.ts");
        const src3 = path.join(this.ROOT_DIR, "/src/templates/browser.module.dev.ts");
        const dest3 = path.join(process.cwd(), scriptRootDir, "browser.module.ts");
        return new rxjs_1.Observable(observer => {
            try {
                fs.copySync(src, dest);
                fs.copySync(src2, dest2);
                fs.copySync(src3, dest3);
                observer.complete();
            }
            catch (err) {
                observer.error(err);
            }
        });
    }
    compileTypescript(fileNames, options) {
        return new rxjs_1.Observable(observer => {
            if (fileNames.length == 0)
                return observer.error(`Typescript App Files not found`);
            let program = ts.createProgram(fileNames, options);
            let emitResult = program.emit();
            let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
            allDiagnostics.forEach(diagnostic => {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                if (!diagnostic.file.fileName.includes("node_modules")
                    && !message.includes("Cannot find name 'Promise'")) {
                    observer.next(chalk.yellow(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`));
                }
            });
            let exitCode = emitResult.emitSkipped ? 1 : 0;
            if (exitCode == 1)
                return observer.error(`Couldn't complete compilation`);
            return observer.complete();
        });
    }
    rewriteProcfile() {
        return new rxjs_1.Observable(observer => {
            let filename = path.join(process.cwd(), "Procfile");
            fs.writeFile(filename, "web: nodemon server/main.js", 'utf8', (err) => {
                if (err)
                    return observer.error(err);
                return observer.complete();
            });
        });
    }
    addModuleIdToComponents() {
        const rootDir = this.config.get("scripts.rootDir");
        const patterns = `${rootDir}/**/*.component.ts`;
        return new rxjs_1.Observable(observer => {
            let srcFiles = globby.sync(patterns);
            srcFiles.forEach(srcFile => {
                let contents = fs.readFileSync(srcFile).toString().split('\n');
                let moduleIndex = contents.findIndex(line => line.includes('moduleId: module.id'));
                let index = contents.findIndex(line => line.includes('@Component({'));
                if (index !== -1 && moduleIndex == -1) {
                    contents[index] = `${contents[index]}\n\tmoduleId: module.id,`;
                    fs.writeFileSync(srcFile, contents.join('\n'), 'utf8');
                }
            });
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
exports.AppTask = AppTask;
//# sourceMappingURL=app-task.js.map