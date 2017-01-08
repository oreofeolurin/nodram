"use strict";
const clispinner = require("cli-progress-spinner");
const chalk = require("chalk");
let spinner;
function start(msg = '') {
    if (spinner) {
        spinner.stop();
    }
    spinner = clispinner({
        text: chalk.yellow(msg),
        color: 'yellow',
        spinner: 'growVertical',
        enabled: true,
        stream: process.stdout
    }).start();
}
exports.start = start;
function stop() {
    spinner.stop();
}
exports.stop = stop;
//# sourceMappingURL=spinner.js.map