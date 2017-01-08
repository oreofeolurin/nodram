/**
 * Created by EdgeTech on 8/6/2016.
 */
import {Injectable, Inject} from '@angular/core';
import {Http} from "@angular/http";
import {IAdminCredential} from "../models/Admin";
import {Service} from "./Service";
import {RResponse} from "../helpers/RResponse";
import {Store} from "../helpers/Store";
import {RConstants} from "../helpers/RConstants";
import {JwtHelper, tokenNotExpired} from "./AuthHttp";

@Injectable()
export class AuthService extends Service {

    private jwtHelper: JwtHelper = new JwtHelper();

    isLoggedIn: boolean = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;


    /**
    * AuthService constructor.
    *
    * @constructor
    * @param {Http} http.
    */
    public constructor(@Inject(Http) http: Http) {
        super(http);
        this.authenticateAccessToken();
    }


    public login(credential: IAdminCredential) {

      return new Promise((resolve, reject) =>{

          this.requestAccessToken(credential).then(response => {

              this.saveAccessToken(response.body["token"]);
              this.isLoggedIn = true;
              resolve(response.code);

          }).catch(err =>reject(this.getRError(err)))


    });

    }


    public logout() {
     if(Store.deleteStore(RConstants.STORE_KEY))
         this.isLoggedIn = false;
    }


    /**
     * Prepares requestObject for sending confirmation email to operator.
     *
     * @param {string} email - User's email address.
     * @return {Promise<RResponse>}
     */
    public sendEmailConfirmation(email: string): Promise<RResponse>{

        var body = {email : email, userType : "user"};

        var requestObject = this.prepareRequest('/account/confirm/send/email', body);

        //lets now perform the request
        return this.sendToServer(requestObject);


    }

    public confirmAccount(email: string, otp: number):Promise<RResponse>{

        var body = {email : email, otp : otp};

        var requestObject = this.prepareRequest('/account/confirm/email', body);

        //lets now perform the request
        return this.sendToServer(requestObject);
    }



    private authenticateAccessToken(){

        var token = this.getAccessToken();

       if(tokenNotExpired(null,token))
           this.isLoggedIn = true;

    }



    private saveAccessToken(token): boolean{

        return Store.saveToStore(RConstants.JWT_TOKEN_STORE_KEY,token);

    }

    private getAccessToken(){
        return Store.getFromStore(RConstants.JWT_TOKEN_STORE_KEY);
    }

    private getDecodedAccessToken(){

        let token = Store.getFromStore(RConstants.JWT_TOKEN_STORE_KEY);

        if(token) {
            return this.jwtHelper.decodeToken(token);
        }

    }


    /**
     * Prepares requestObject for creating session token and sends to server.
     *
     * @param {UserCredential} userCredential - Admin Credential for login.
     * @return {Promise<RResponse>}
     */
    private requestAccessToken(credential : IAdminCredential): Promise<RResponse>{

        var requestObject = this.prepareRequest('/account/create/admin/token',credential);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
}
