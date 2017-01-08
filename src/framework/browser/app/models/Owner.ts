/**
 * Created by EdgeTech on 10/11/2016.
 */
import {User, IUser} from "./User";
import {Privilege} from "../helpers/Privilege";

export interface IOwner extends IUser{
    approved: boolean,
}


export class Owner extends User{
    public approved: boolean;

    constructor();
    constructor(owner?: IOwner){
        super(owner);

        if(typeof owner === "object") {
            this.approved = owner.approved;

        }
    }
}