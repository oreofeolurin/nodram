import * as express from "express";
import {logger, RError} from "../helpers";

export abstract class Router{

    
    protected router : express.Router;

    constructor(){
        this.router = express.Router();
    }

    //Abstract class to create routes
    abstract createRoutes(): express.Router;


    public catchErrors(err:any, res:express.Response){
        
        if (!(err instanceof RError))
            err = new RError(err);

        logger.warn(err.toString());
        res.status(err.status).json(err.toObject());
    }

}
