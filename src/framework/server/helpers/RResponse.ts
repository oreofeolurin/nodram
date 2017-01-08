export class RResponse{

    public static SUCCESS : number  =  200;

    public static EMAIL_INVALID : number  =  4001;

    public static REQUEST_ACCEPTED :   number  = 202;

    public static BAD_REQUEST : number  = 400;

    public static UNAUTHORIZED : number  = 401;

    public static SERVER_ERROR : number  = 500;

    public static PAYSTACK_ERROR : number  = 505;


    public code : number;

    public message : string;

    public body : Object;

    constructor(code : number, message :  string, body? : Object){
        this.code = code;
        this.message = message;

        if(typeof body !== "undefined")
            this.body= body;
    }


    public toObject() : Object {
        if(typeof this.body === "undefined")
            return {code : this.code, message : this.message};
        else
            return {code : this.code, message : this.message, body : this.body};
    }


    public toString(){
        if(typeof this.body === "undefined")
            return "code = " +  this.code + ", message = " + this.message;
        else
            return "code = " +  this.code + ", message = " + this.message + ", body = " + this.body;

    }


}