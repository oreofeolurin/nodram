"use strict";
const dev_1 = require("./dev/dev");
const prod_1 = require("./prod/prod");
const prod_aot_1 = require("./prod/prod.aot");
class BuildTask {
    constructor(ROOT_DIR, command) {
        this.ROOT_DIR = ROOT_DIR;
        let option = typeof command !== "undefined" ? command.opts()["prod_mode"] : null;
        if (option == null)
            this.builder = new dev_1.Builder(ROOT_DIR);
        else if (option == "prod") {
            this.builder = new prod_1.Builder(ROOT_DIR);
        }
        else if (option == "prod-aot")
            this.builder = new prod_aot_1.Builder(ROOT_DIR);
        else
            this.builder = new dev_1.Builder(ROOT_DIR);
        console.log();
    }
    build() {
        return this.builder.build();
    }
}
exports.BuildTask = BuildTask;
//# sourceMappingURL=index.js.map