import {RResponse} from './RResponse';
import {logger} from "./Logger";

export class RError extends RResponse{

    constructor(code : number, message :  string);
    constructor(err: Error);
    constructor(code_err : any, message? : any){

        let code : number = typeof code_err === "number" ? code_err : null;

        if(code_err instanceof Error) {
           let error =  RError.handleError(code_err);
            code = error.code;
            message = error.message;
        }


        super(code,message);

    }

    public static handleError(err){
        let code : number;
        let message : string;

        if (err.code) {
            switch (err.code) {
                case 11000:
                case 11001:
                    code = 1103;
                    message = "Email Already Exists";
                    break;
                case "ENOENT":
                    code = 5001;
                    message = "Internet Unavailable";
                    break;
                default:
                    code = 500;
                    message = err.message || "Service Unavailable";
            }
        } else {

            if(!err.errors) {
                code = 500;
                message = err.message;
            }

            else {
                for (var errName in err.errors) {
                    if (err.errors[errName].message) {
                        code = RResponse.BAD_REQUEST;
                        message = err.errors[errName].message;
                    }
                    else {
                        code = 500;
                        message = "Service Unavailable";
                    }
                }
            }
        }

        return {code : code, message : message};
    }
    
    
    public static get UNKNOWN_USER(){
        return new RError(1101, "Unknown User");
    }
    
    public static get INVALID_PASSWORD(){
        return new RError(1102, "Invalid Password");
    }
        
    
    public static get EMAIL_EXISTS(){
        return new RError(1103, "Email Already Exists");
    }

    public static get EXPIRED(){
        return new RError(1104, "Internet Unavailable");
    }

    public static get ACCOUNT_UNCONFIRMED(){
        return new RError(1105, "Account Unconfirmed");
    }

    public static get UNKNOWN_APP(){
        return new RError(1106, "Unknown App");
    }


    public static get INSUFFICIENT_FUND(){
        return new RError(1107, "Insufficient Fund");
    }
    
    public static get SERVICE_UNAVAILABLE(){
        return new RError(500, "Service Unavailable");
    }
    
    public static get INTERNET_UNAVAILABLE(){
         return new RError(5001, "Internet Unavailable");
    }



           
 }




function getErrorMessage(err): RError{
    var error : RError;

    if(err instanceof RError)
        error = err

    else if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                error = RError.EMAIL_EXISTS;
                break;
            case "ENOENT":
                error = RError.INTERNET_UNAVAILABLE;
                break;
            default:
                error = RError.SERVICE_UNAVAILABLE;
                break;
        }
    } else {

        for (var errName in err.errors) {
            if (err.errors[errName].message)
                error = new RError(RResponse.BAD_REQUEST,err.errors[errName].message);
            else
                error = RError.SERVICE_UNAVAILABLE;
        }
    }

    return error;

}

 
 