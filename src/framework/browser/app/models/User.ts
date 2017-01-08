

import {RConstants} from "../helpers/RConstants";
export interface IUserCredential{
    email : string;
    password : string;
}


export class UserCredential{
    email : string = null;
    password : string = null;

    constructor();
    constructor(userCredential: IUserCredential);
    constructor(userCredential?: IUserCredential){

        if(typeof userCredential !== "undefined"){
            this.email = userCredential.email;
            this.password = userCredential.password;
        }

    }
}

export interface IUserName{
    full: string,
    first: string,
    last: string
}

export interface IUser{
    id: string,
    email : string;
    name : IUserName;
    photo : any;
    wallet : { balance : number};
    cards : Array<Object>;
}

class Avatar{
    public thumb: string;
    public medium: string;
    public full: string;
    public static DEFAULT = RConstants.STATIC_DOMAIN + "/res/images/icons/avatar.png";

    constructor(){
        //set default value
        this.thumb = this.medium = this.full = Avatar.DEFAULT;
    }

    public setUrls(thumb: string, medium: string, full: string){
        this.thumb = thumb;
        this.medium = medium;
        this.full = full;
    }
}

export class User{

    public id = null;
    public email = null;
    public name : IUserName = null;
    public photo : any;
    public avatar : Avatar = new Avatar();
    public wallet : { balance : number};
    public cards : Array<Object>;

    constructor();
    constructor(user: IUser);
    constructor(user?: IUser){
        if(typeof user !== "undefined"){
            this.id = user.id;
            this.email = user.email;
            this.name = user.name;
            this.photo = user.photo;
            this.wallet = user.wallet;
            this.cards = user.cards;

            this.setAvatar(this.photo);
        }
    }

    public setAvatar(photo: Avatar){

         if(photo !== null && typeof photo === "object")
             this.avatar.setUrls(photo["url"]["thumb"],photo["url"]["medium"],photo["url"]["full"]);

    }

}


export interface IUserModel{
    email : string;
    password : string;
    name : IUserName;
}



export class UserModel implements IUserModel{

    public email = null;
    public password = null;
    public name : IUserName | any = {};

    constructor();
    constructor(operator: IUserModel);
    constructor(operator?: IUserModel){
        if(typeof operator !== "undefined"){
            this.email = operator.email;
            this.password = operator.password;
            this.name = operator.name;
        }
    }

    /**
     * Get Object type representation of User type
     * @return {Object}
     */
    public toObject(): Object{
        return {
            email : this.email,
            password : this.password,
            name : JSON.stringify({full : this.name.full})
        };
    }

}
