import * as winston from "winston";
//require("winston-syslog").Syslog;

class Logger{
    
    public logger :  winston.LoggerInstance;
    
    constructor(){
        
        this.logger =  new (winston.Logger)({
            transports: [
               // new (winston.transports.Syslog)({level : 'debug', colorize: true}),
                new (winston.transports.Console)({level : 'debug', colorize: true})
            ],
            exitOnError: false
        });
    }

    
}

export var logger = new Logger().logger;