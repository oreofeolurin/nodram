import * as http from 'http';
import * as path from 'path';
import * as ejs from 'ejs';
import * as express from 'express';
import * as compress from "compression";
import * as morgan from 'morgan';

import {RenderRouter} from "./routers/RenderRouter";

const ROOT = path.join(path.resolve(__dirname, '..'));
const VIEW_DIR = path.join(path.resolve(__dirname, './views'));

export class WebServer {

    constructor() {}

    public start(){
        let app = express();
        let server = http.createServer(app);


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
        const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        app.use('/node_modules', express.static(path.join(ROOT, 'node_modules'), {maxAge: MILLISECONDS_IN_A_DAY}));
        app.use('/scripts/bundles', express.static(path.join(ROOT, '/static/scripts/bundles'), {maxAge: MILLISECONDS_IN_A_DAY}));
        app.use(express.static(path.join(ROOT, 'static'), {index: false}));
        app.use(express.static(path.join(ROOT, 'browser')));




        //Create SITE Routes
        let renderRoute = new RenderRouter().createRoutesHTML();
        app.use("/",renderRoute);



        return server;

    }




}





