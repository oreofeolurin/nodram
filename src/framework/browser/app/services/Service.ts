import {Http, Headers, Request, RequestOptions, RequestMethod} from "@angular/http";
import {RResponse, Utils} from "../helpers/index";
import {RConstants} from "../helpers/RConstants";
import {RError} from "../helpers/RError";

export class Service{

    /**
     * Service constructor.
     *
     * @constructor
     * @param http.
     */
    public constructor(private http: any) {}

    /**
     * Prepares request object to send to server.
     * @param {string} url - Request url.
     * @param {Object} body - Request Body.
     * @param {RequestMethod} method - Request Method.
     * @return {Request}
     */
    public prepareRequest(url : string, bodyObject? : Object, method? : RequestMethod, headers?: Headers): Request{

        let body: string = null;

        //create header if undefined
        if(typeof headers === "undefined"){
            //Create headers
            headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }

        if(typeof  method === "undefined")
            method = RequestMethod.Post;

        if(typeof bodyObject !== "undefined")
            body = Utils.URIEncodeObject(bodyObject);



        //Create the request object options
        var options = new RequestOptions({
            body :  body,
            method : method,
            url : RConstants.API_BASE + url,
            headers : headers
        });


        return new Request(options);
    }

    public sendToServer(requestObject :  Request) : Promise<RResponse>;
    public sendToServer(requestObject :  Request,  returnAsObservable: boolean);
    public sendToServer(requestObject :  Request, returnAsObservable? : boolean): any {
        if(typeof returnAsObservable === "undefined")
            return this.sendToServerGetPromise(requestObject);

        return this.sendToServerGetObservable(requestObject);
    }

    //  public sendToServer(requestObject :  Request, resolve : Function , reject : Function, complete? : Function);
    // public sendToServer(requestObject :  Request, resolve? : Function , reject? : Function, complete? : Function) {


    /**
     * Sends request object to server and handles apropiate callbacks.
     * @param {Request} requestObject - Request object.
     * @param {Function} resolve - Resolve function.
     * @param {Function} reject - Reject Function.
     */
    public sendToServerGetObservable(requestObject :  Request){
        
        return this.sendRequest(requestObject).map(res => res.json());
    }



    /**
     * Sends request object to server and handles apropiate callbacks.
     * @param {Request} requestObject - Request object.
     * @param {Function} resolve - Resolve function.
     * @param {Function} reject - Reject Function.
     */
    public sendToServerGetCallback(requestObject :  Request, resolve : Function , reject : Function, complete? : Function){

        if(typeof complete === "undefined")
            complete = () => {return true;};


        this.sendRequest(requestObject).map(res => res.json())
            .subscribe(
                data => resolve(data),
                err => reject(JSON.parse(err._body)),
                () => complete()
            );
    }

    /**
     * Sends request object to server and handles and returns a promise.
     * @param {Request} requestObject - Request object.
     */
    public sendToServerGetPromise(requestObject :  Request): Promise<Object>{

        return this.sendRequest(requestObject).map(res => res.json()).toPromise();
    }


    public sendRequest(requestObject){
        return  this.http.request(requestObject);
    }


    protected getRError(err): RError{

        if(err.status == 0)
            return RError.INTERNET_UNAVAILABLE;

        if(err.status === RResponse.SERVER_ERROR)
            return RError.SERVICE_UNAVAILABLE;


        var body = JSON.parse(err._body);
        var error;

        switch(body.code){
            case RError.UNKNOWN_ACCOUNT.code:
            case RError.INVALID_PASSWORD.code:
                error = RError.INVALID_PASSWORD;// "Invalid email and password combination";
                break;
            case RError.ACCOUNT_UNCONFIRMED.code:
                error =  RError.ACCOUNT_UNCONFIRMED;
                break;
            case RError.ACCOUNT_UNAUTHORIZED.code:
                error =  RError.ACCOUNT_UNAUTHORIZED;
                break;
            default:
                error = RError.SERVICE_UNAVAILABLE;
                break;
        }
        
        return error;

    }


}
