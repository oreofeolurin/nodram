/**
 * Created by EdgeTech on 11/2/2016.
 */
import {Vehicle} from "./Vehicle";
import {User} from "./User";


export class Driver{
    public user: User;
    public id = null;
    public lastKnownLocation : {coordinates : Array<number>};
    public cards : Array<Object>;
    public vehicle: Vehicle;
    public authorized: boolean;

    constructor();
    constructor(data);
    constructor(data){
        if(typeof data !== "undefined"){
            this.id = data.id;
            this.user = new User(data["user"]);
            this.lastKnownLocation = data.lastKnownLocation;
            this.vehicle = new Vehicle(data.vehicle);
            this.authorized = data.authorized;
        }
    }
    


    
    
}