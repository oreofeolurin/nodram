"use strict";
const RConfig_1 = require("../../helpers/RConfig");
const rxjs_1 = require("rxjs");
const ts = require("typescript");
const fs = require("fs");
const globby = require("globby");
const chalk = require("chalk");
const spinner = require("../../helpers/spinner");
const Utils_1 = require("../../helpers/Utils");
class TypescriptWatch {
    constructor() {
        this.config = new RConfig_1.RConfig();
    }
    watch() {
        return new rxjs_1.Observable(observer => {
            const config = this.config;
            const rootDir = config.get("scripts.rootDir");
            const patterns = config.get("scripts.excludes").map(v => `!${rootDir}/${v}`);
            patterns.unshift(rootDir + "/**/*.ts");
            patterns.push("./server/**/*.ts");
            patterns.push("!./server/node.module.ts");
            // Initialize files constituting the program as all .ts files in the current directory
            const currentDirectoryFiles = globby.sync(patterns);
            // Start the watcher
            this.watchTypescript(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS }, observer);
        });
    }
    watchTypescript(rootFileNames, options, observer) {
        //const files: ts.Map<{ version: number }> = {};
        const files = {};
        // initialize the list of files
        rootFileNames.forEach(fileName => {
            files[fileName] = { version: 0 };
        });
        // Create the language service host to allow the LS to communicate with the host
        const servicesHost = {
            getScriptFileNames: () => rootFileNames,
            getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
            getScriptSnapshot: (fileName) => {
                if (!fs.existsSync(fileName)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
            },
            getCurrentDirectory: () => process.cwd(),
            getCompilationSettings: () => options,
            getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        };
        // Create the language service files
        this.services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
        // Now let's watch the files
        rootFileNames.forEach(fileName => {
            // First time around, emit all files
            // this.emitFile(fileName,observer);
            // Add a watch on the file to handle next change
            fs.watchFile(fileName, { persistent: true, interval: 250 }, (curr, prev) => {
                // Check timestamp
                if (+curr.mtime <= +prev.mtime) {
                    return;
                }
                // Update the version to signal a change in the file
                files[fileName].version++;
                // write the changes to disk
                this.emitFile(fileName, observer);
            });
        });
    }
    emitFile(fileName, observer) {
        spinner.start(`Compiling ${fileName}...`);
        let start = new Date();
        let output = this.services.getEmitOutput(fileName);
        if (output.emitSkipped) {
            this.logErrors(fileName, observer);
        }
        output.outputFiles.forEach(o => {
            fs.writeFileSync(o.name, o.text, "utf8");
            let time = new Date().getTime() - start.getTime();
            spinner.stop();
            observer.next(`${chalk.green('✔')} ${chalk.blue(`Compiled typescript file (${o.name}): ${Utils_1.Utils.timeHuman(time)}`)}`);
        });
    }
    logErrors(fileName, observer) {
        let allDiagnostics = this.services.getCompilerOptionsDiagnostics()
            .concat(this.services.getSyntacticDiagnostics(fileName))
            .concat(this.services.getSemanticDiagnostics(fileName));
        allDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                observer.next(chalk.yellow(`Wanning ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`));
            }
            else {
                observer.error(`Error: ${message}`);
            }
        });
    }
}
exports.TypescriptWatch = TypescriptWatch;
//# sourceMappingURL=TypescriptWatch.js.map