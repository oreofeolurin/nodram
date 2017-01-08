import {Injectable, Inject} from '@angular/core';
import {RequestMethod} from '@angular/http';
import {Service} from "./Service";
import {AuthHttp} from './AuthHttp';

@Injectable()
export class TransportService extends Service{

    /**
     * TransportService constructor.
     *
     * @constructor
     * @param {Http} http.
     */
    public constructor(@Inject(AuthHttp) http: AuthHttp) {super(http);}

    
    public getAdminDetails(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/profile',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
    
    public getAllAdmins(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/all',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
    
    public getAllOwners(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/owner/all',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }


    public getAllTransactions(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/transaction/all',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }


    public getAllDrivers(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/driver/all',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }

    public getAllPassengers(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/passenger/all',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }
    
    public getPassengerInfo(userId: string): Promise<Object>{

        let requestObject = this.prepareRequest(`/admin/passenger/${userId}`,null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }


    public getUserStats(): Promise<Array<Object>>{

        let requestObject = this.prepareRequest('/admin/user/stats',null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }

    public createAdmin(admin: Object): Promise<Object>{

        let requestObject = this.prepareRequest('/admin/create/admin',admin);

        //lets now perform the request
        return this.sendToServer(requestObject);
    }

    public getPhotoDetails(photoId: string): Promise<Array<Object>>{

        let requestObject = this.prepareRequest(`/photo/${photoId}`,null,RequestMethod.Get);

        //lets now perform the request
        return this.sendToServer(requestObject);

    }




}


