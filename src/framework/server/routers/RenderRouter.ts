import * as express from "express";
import {Router} from "./Router";
import {  ExpressEngineConfig } from 'angular2-express-engine';
import {MainModule} from "../node.module";

export class RenderRouter extends Router{

    constructor(){
        super();
    }

    /**
     * Create router with configured routes
     * @return express.Router
     */
    public createRoutes(): express.Router{
       
        this.router.get("/", this.serve.bind(this));

        return this.router;

    }


    /**
     * Create router with configured routes
     * @return express.Router
     */
    public createRoutesHTML(): express.Router{

        this.router.get("/", this.htmlServe.bind(this));

        return this.router;

    }

    public serve(req: express.Request, res: express.Response){
        //TODO check pressure on server and decide what to us to serve it
        this.ngServe(req,res);
        
       // this.htmlServe(req,res);
    }
    
    
    private htmlServe(req: express.Request, res: express.Response){
        // Route to render index
        res.render("index");
    }
    

   public ngServe(req: express.Request, res: express.Response) {

       // 2. get the top level NgModule for the app and pass in important values to Angular Universal 
       
       // Our Universal - express configuration object
       const expressConfig : ExpressEngineConfig = {
           req,
           res,
           preboot: false,
           baseUrl: '/',
           requestUrl: req.originalUrl,
           originUrl: `http://localhost:${ process.env.PORT}`
       };

       // NOTE: everything passed in here will be set as properties to the top level Zone
       // access these values in your code like this: Zone.current.get('req');
       // this is temporary; we will have a non-Zone way of getting these soon
       res.render('index', expressConfig);
       
    }



}
