import {Injectable, Inject, Type} from '@angular/core'
import {User} from "../models/User";
import {TransportService} from "./TransportService";
import {Subject, BehaviorSubject} from "rxjs/Rx";
//import {ModalService} from "./ModalService";
import {Modal} from "../models/Modal";
import {AuthService} from "./AuthService";
import {RResponse} from "../helpers/RResponse";
import {Router} from "@angular/router";
import {Admin, IAdmin} from "../models/Admin";
import {Navigation} from "../models/Navigation";
import {APP_NAVIGATION} from "../shared/shared.assets";
import {Owner} from "../models/Owner";
import {UsersRequest} from "./UsersRequest";


@Injectable()
export class AppService {

    private usersRequest: UsersRequest;

    private admin : Admin = new Admin();

    // Observable subjects
    private adminSubject = new BehaviorSubject<Admin>(this.admin);
    private modalSubject = new Subject<Modal>();

    //Observable streams
    public adminUpdates = this.adminSubject.asObservable();
    public modalUpdates = this.modalSubject.asObservable();


    private appNavigation: Navigation;


    constructor(@Inject(AuthService) private authService: AuthService,
                @Inject(TransportService) private transportService: TransportService,
                @Inject(Router) private router: Router) {

        //setup app wide navigation
        this.setAppNavigation();
        
        
        //initialize request providers
        this.initializeRequestsProviders();
    }
    
    private initializeRequestsProviders(){
        this.usersRequest = new UsersRequest(this.transportService);
    }

    public fetchAdmin(){
        this.transportService.getAdminDetails().then(response => this.setAdmin(response["body"]))
            .catch(err => this.catchErrors(err));
    }

    private setAdmin(adminDetails: IAdmin) {
        this.admin = new Admin(adminDetails);
        this.adminSubject.next(this.admin);

        //lets check if photo exist
        if(typeof this.admin.photo === "string")
            this.fetchProfilePhoto(this.admin.photo);
    }


    private fetchProfilePhoto(photoId){
        this.transportService.getPhotoDetails(photoId).then(response => {
            if(response["body"]["processed"]){
                this.admin.setAvatar(response["body"]);
            }
            else{
                this.admin.setAvatar(null);
            }
        }).catch(err =>this.catchErrors(err))
    }

    private setAppNavigation(){
        this.appNavigation = new Navigation(APP_NAVIGATION);
   }

    public getAppNavigation(){
        return this.appNavigation;
    }

    public getAdmin(){
        return this.admin;
    }


    public getAllAdmins(): Promise<Array<Admin>>{

        return new Promise((resolve, reject) => {

            this.transportService.getAllAdmins().then(response => {

                resolve(response["body"]);

            }).catch(err =>this.catchErrors(err))

        })
    }


    public getAllDrivers(): Promise<Array<Owner>>{

        return new Promise((resolve, reject) => {

            this.transportService.getAllDrivers().then(response => {

                resolve(response["body"]);

            }).catch(err =>this.catchErrors(err))

        })
    }
    
    public getAllOwners(): Promise<Array<Owner>>{

        return new Promise((resolve, reject) => {

            this.transportService.getAllOwners().then(response => {

                resolve(response["body"]);

            }).catch(err =>this.catchErrors(err))

        })
    }
    
    public getAllTransactions(): Promise<Array<Owner>>{

        return new Promise((resolve, reject) => {

            this.transportService.getAllTransactions().then(response => {

                resolve(response["body"]);

            }).catch(err =>this.catchErrors(err))

        })
    }

    public getAllPassengers(): Promise<Array<Object>>{

        return new Promise((resolve, reject) => {

            this.transportService.getAllPassengers()
                .then(response => resolve(response["body"]))
                .catch(err =>this.catchErrors(err))
        })
    }
    
    
    public getPassengerInfo(userId: string): Promise<User>{

        return new Promise((resolve, reject) => {
    
            this.transportService.getPassengerInfo(userId)
                .then(response => resolve(response["body"]))
                .catch(err =>this.catchErrors(err))

        })
    }


    /**
     * Prepares all users request then performs them
     *
     * @param requestName<string>
     * @param requestArgs<Array>
     * @returns {Promise<Object>}
     */
    public callUsersRequest(requestName: string,requestArgs: Array<Object>): Promise<Object>{

        return new Promise((resolve, reject) => {
            this.usersRequest
                .performRequest(requestName,requestArgs)
                .then(response => resolve(response["body"]))
                .catch(err =>this.catchErrors(err))
        });
    }
    
    public getUserStats(): Promise<Array<Owner>>{

        return new Promise((resolve, reject) => {

            this.transportService.getUserStats().then(response => {

                resolve(response["body"]);

            }).catch(err =>this.catchErrors(err))

        })
        
    }


    public createAdmin(admin): Promise<Array<Admin>>{

        return new Promise((resolve, reject) => {

            this.transportService.createAdmin(admin)
                .then(response => resolve(response["body"]))
                .catch(err => this.catchErrors(err,reject))

        })
    }


    
    public loadModal(modal: Modal){
        this.modalSubject.next(modal)
    }
    
    public logout(){
        this.admin = new Admin();
        this.authService.logout();
    }


    /**
     * Utility function to catch errors
     * basically it checks if its an unauthorised error
     * it logs out immediately if its an unauthorised error
     *
     * @param err
     * @param reject
     */
    public catchErrors(err, reject?:Function){

        if(err.status === RResponse.UNAUTHORIZED) {
            this.authService.redirectUrl = this.router.routerState.snapshot.url;
            this.logout();
            this.router.navigate(["/"]);
        }
        else if(err.status === 0) {
            //TODO announce app wide no internet
            console.log("non internet");
        }
        else if(typeof reject == "function")
            reject(err);
    }

}
