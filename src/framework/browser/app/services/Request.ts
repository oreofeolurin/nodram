
import {TransportService} from "./TransportService";

export class Request{
    constructor(protected transportService: TransportService){}

    public performRequest(requestName,requestArgs){
        let requestObject = this[requestName](...requestArgs);

        //lets now perform the request
        return this.transportService.sendToServer(requestObject);
    }

}
