// polyfills have to be first

import 'angular2-universal-polyfills';
import 'ts-helpers';
import './helpers/__workaround.node'; //temporary until 2.1.1 things are patched in Core
import 'angular2-universal-polyfills';


import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as compress from "compression";
import * as morgan from 'morgan';
import {createEngine} from 'angular2-express-engine';
import {RenderRouter} from "./routers/RenderRouter";
import {MainModule} from "./node.module";
import {enableProdMode} from "@angular/core"; // will change depending on your app


const ROOT = path.join(path.resolve(__dirname, '..'));
const VIEW_DIR = path.join(path.resolve(__dirname, './views'));

export class WebServer {

    constructor() {

        // enable prod for faster renders
        enableProdMode();
    }

    public start(){
        let app = express();
        let server = http.createServer(app);


        if (process.env.NODE_ENV === "development") {
            app.use(morgan('dev'));
        }

        if (process.env.NODE_ENV === 'production') {
            app.use(compress());
        }

        // 1. set up Angular Universal to be the rendering engine for Express
        app.engine('.html', createEngine({
            ngModule: MainModule,
            precompile: true,
        }));

        app.set('views', VIEW_DIR);
        app.set('view engine', 'html');


        // Serve static files
        const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        app.use(express.static(path.join(ROOT, 'static'), {index: false, maxAge: MILLISECONDS_IN_A_DAY}));

        //Create SITE Routes
        let renderRoute = new RenderRouter().createRoutes();
        app.use("/",renderRoute);


        return server;

    }


}





