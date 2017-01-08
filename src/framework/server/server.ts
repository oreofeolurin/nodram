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
    private engineConfig: Object;

    constructor() {

        //Set the engine config;
        this.setEngineConfig();

        // enable prod for faster renders
        enableProdMode();
    }

    public start(){
        let app = express();
        let server = http.createServer(app);


        if (process.env.NODE_ENV === "development") {
           app.use(morgan('combined'));
        }

        if (process.env.NODE_ENV === 'production') {
            app.use(compress());
        }


        // 1. set up Angular Universal to be the rendering engine for Express
        app.engine('.html', createEngine(this.engineConfig));

        app.set('views', VIEW_DIR);
        app.set('view engine', 'html');


        // Serve static files
        // app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
        app.use(express.static(path.join(ROOT, 'static'), {index: false}));

        //Create SITE Routes
        let renderRoute = new RenderRouter().createRoutes();
        app.use("/",renderRoute);



        return server;

    }


    private setEngineConfig(){

        let engineConfig : any = {
            ngModule: MainModule,
            precompile: true,
        };
        this.engineConfig = engineConfig;
    }



}





