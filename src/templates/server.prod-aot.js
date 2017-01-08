// polyfills have to be first
"use strict";
require("angular2-universal-polyfills");
require("ts-helpers");
require("./helpers/__workaround.node"); //temporary until 2.1.1 things are patched in Core
require("angular2-universal-polyfills");
var http = require("http");
var path = require("path");
var express = require("express");
var compress = require("compression");
var morgan = require("morgan");
var core_1 = require("@angular/core");
var angular2_express_engine_1 = require("angular2-express-engine");
var RenderRouter_1 = require("./routers/RenderRouter");
var node_module_ngfactory_1 = require("./node.module.ngfactory"); // will change depending on your app
var ROOT = path.join(path.resolve(__dirname, '..'));
var VIEW_DIR = path.join(path.resolve(__dirname, './views'));
var WebServer = (function () {
    function WebServer(workerId) {
        this.workerId = workerId;
        // enable prod for faster renders
        core_1.enableProdMode();
    }
    WebServer.prototype.start = function () {
        var app = express();
        var server = http.createServer(app);
        if (process.env.NODE_ENV === "development") {
            app.use(morgan("dev"));
        }
        if (process.env.NODE_ENV === 'production') {
            app.use(compress());
        }
        // 1. set up Angular Universal to be the rendering engine for Express
        app.engine('.html', angular2_express_engine_1.createEngine({
            precompile: false,
            ngModule: node_module_ngfactory_1.MainModuleNgFactory,
        }));
        app.set('views', VIEW_DIR);
        app.set('view engine', 'html');
        // Serve static files
        var MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        app.use(express.static(path.join(ROOT, 'static'), { index: false, maxAge: MILLISECONDS_IN_A_DAY }));
        //Create SITE Routes
        var renderRoute = new RenderRouter_1.RenderRouter().createRoutes();
        app.use("/", renderRoute);
        return server;
    };
    return WebServer;
}());
exports.WebServer = WebServer;
