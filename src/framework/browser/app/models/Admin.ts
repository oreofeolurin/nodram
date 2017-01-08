/**
 * Created by EdgeTech on 8/29/2016.
 */
import {User, IUser} from "./User";
import {Privilege} from "../helpers/Privilege";

export interface IAdminCredential{
    email: string,
    password: string
}

export interface IAdmin extends IUser{
    isSuper: boolean,
}


export class Admin extends User{
    public isSuper: boolean;
    public level: Privilege;

    constructor();
    constructor(admin: IAdmin);
    constructor(admin?: IAdmin){
        super(admin);

        if(typeof admin === "object") {
            this.isSuper = admin.isSuper;

            if(this.isSuper)
                this.level = Privilege.SUPER;
            else
                this.level = Privilege.NOMINAL;

        }
    }
}