/**
 * Created by EdgeTech on 11/2/2016.
 */

import {TransportService} from "./TransportService";
import {RequestMethod} from "@angular/http";
import {Request} from "./Request";

export class UsersRequest extends Request{

    constructor(transportService: TransportService){ super(transportService)}

    public getDriversInfo(driverId){
        return this.transportService.prepareRequest(`/admin/driver/${driverId}`,null,RequestMethod.Get);

    }

    
}