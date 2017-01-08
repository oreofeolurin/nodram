/**
 * Created by EdgeTech on 11/16/2016.
 */

import {Injectable, Inject} from '@angular/core';
import {Http, RequestMethod} from "@angular/http";
import {IAdminCredential} from "../models/Admin";
import {Service} from "./Service";
import {RResponse} from "../helpers/RResponse";
import {Store} from "../helpers/Store";
import {RConstants} from "../helpers/RConstants";
import {JwtHelper, tokenNotExpired} from "../helpers/AuthHttp";
import {RError} from "../helpers/RError";

@Injectable()
export class GraphService extends Service {

    /**
     * AuthService constructor.
     *
     * @constructor
     * @param {Http} http.
     */
    public constructor(@Inject(Http) http: Http) {
        super(http);
    }

    public searchTrips(parameters: Object): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/graph/trip/search',parameters,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }


    public getTripById(tripId: string): Promise<Array<Object>>{

        let requestObject = this.prepareRequest(`/graph/trip/${tripId}`,null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
    
    public subscribeUser(userDetails: Object): Promise<Array<Object>>{

        let requestObject = this.prepareRequest(`/graph/subscribe/user`,userDetails);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
}
