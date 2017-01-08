"use strict";
const chalk = require("chalk");
const SassWatcher_1 = require("./SassWatcher");
const TypescriptWatch_1 = require("./TypescriptWatch");
class WatchTask {
    watch() {
        console.log(chalk.green(`------------------- REAM APP WATCH ----------------------------------`));
        console.log(chalk.blue('watching...'));
        const sassWatch = new SassWatcher_1.SassWatcher();
        const typescriptWatch = new TypescriptWatch_1.TypescriptWatch();
        return sassWatch.watch().merge(typescriptWatch.watch());
    }
}
exports.WatchTask = WatchTask;
//# sourceMappingURL=index.js.map