#!/usr/bin/env node --harmony


//import ts class
import {RConfig} from './lib/helpers/RConfig';
const config = new RConfig();
const APP_TYPE = config.get("type");
const app = require('./lib/cmd/'+APP_TYPE);
const ROOT_DIR = __dirname;
const reamAPP = new app.APP(ROOT_DIR);
reamAPP.start();
