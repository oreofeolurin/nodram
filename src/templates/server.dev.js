"use strict";
var http = require("http");
var path = require("path");
var ejs = require("ejs");
var express = require("express");
var compress = require("compression");
var morgan = require("morgan");
var RenderRouter_1 = require("./routers/RenderRouter");
var ROOT = path.join(path.resolve(__dirname, '..'));
var VIEW_DIR = path.join(path.resolve(__dirname, './views'));
var WebServer = (function () {
    function WebServer() {
    }
    WebServer.prototype.start = function () {
        var app = express();
        var server = http.createServer(app);
        if (process.env.NODE_ENV === "development") {
            //morgan.token('workerId', () => this.workerId.toString());
            //app.use(morgan(":workerId :method :url :status :response-time ms - :res[content-length]"));
            app.use(morgan('dev'));
        }
        if (process.env.NODE_ENV === 'production') {
            app.use(compress());
        }
        // 1. set up Angular Universal to be the rendering engine for Express
        app.engine('html', ejs.renderFile);
        app.set('views', VIEW_DIR);
        app.set('view engine', 'html');
        // Serve static files
        // Serve static files
        var MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        app.use('/node_modules', express.static(path.join(ROOT, 'node_modules'), { maxAge: MILLISECONDS_IN_A_DAY }));
        app.use('/scripts/bundles', express.static(path.join(ROOT, '/static/scripts/bundles'), { maxAge: MILLISECONDS_IN_A_DAY }));
        app.use(express.static(path.join(ROOT, 'static'), { index: false }));
        app.use(express.static(path.join(ROOT, 'browser')));
        //Create SITE Routes
        var renderRoute = new RenderRouter_1.RenderRouter().createRoutesHTML();
        app.use("/", renderRoute);
        return server;
    };
    return WebServer;
}());
exports.WebServer = WebServer;
