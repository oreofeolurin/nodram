#!/usr/bin/env node --harmony
"use strict";
var RConfig_1 = require("./lib/helpers/RConfig");
var config = new RConfig_1.RConfig();
var APP_TYPE = config.get("type");
var app = require('./lib/cmd/' + APP_TYPE);
var ROOT_DIR = __dirname;
var reamAPP = new app.APP(ROOT_DIR);
reamAPP.start();
