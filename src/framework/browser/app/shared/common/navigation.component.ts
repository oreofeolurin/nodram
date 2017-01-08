/**
 * Created by EdgeTech on 8/30/2016.
 */
import {Component, Input, OnInit, Inject} from '@angular/core';
import {NAVIGATION_TEMPLATE, NAVIGATION_STYLES} from "../shared.assets";
import {Admin} from "../../models/Admin";
import {RConstants} from "../../helpers/RConstants";
import {AppService} from "../../services/AppService";
import {Navigation} from "../../models/Navigation";

@Component({
    selector: 'navigation-component',
    template : NAVIGATION_TEMPLATE,
    styles : NAVIGATION_STYLES
    //templateUrl : "navigation.component.html",
    //styleUrls : ["../../styles/shared/navigation.css"]
})

export class NavigationComponent implements OnInit{

    public admin: Admin = new Admin();
//    private animation : NavigationAnimation;
    public STATIC_DOMAIN = RConstants.STATIC_DOMAIN;

    public appNavigation: Navigation;


    constructor(@Inject(AppService) private appService: AppService){

        //subscribe to user update
        appService.adminUpdates.subscribe(admin => this.admin = admin);

    }

    public ngOnInit() {

        //get app navigation
        this.appNavigation = this.appService.getAppNavigation();


        //set animation for this page
       // this.animation = new TopbarAnimation(this.el);

    }

   // public activeRoute: string = "Home";

    // @Input()
    // public user : User;
    //
    // private animation: NavigationAnimation;
    //
    // constructor(private router: Router, private service: AppService){
    //
    //     //this.subscription = service.newMessageBucketStream.subscribe( bucket => this.clearNewMessageIndication());
    //
    // }
    //
    // public ngOnInit() {
    //
    //     this.animation = new NavigationAnimation();
    //
    //     this.router.root.subscribe(route => {
    //
    //
    //         let subRoute =  route.split("/")[1] || "Home";
    //         let routeName = subRoute.charAt(0).toUpperCase() + subRoute.slice(1);
    //
    //         if(routeName.charAt(routeName.length - 1) === "s"){
    //             routeName =  routeName.slice(0, -1);
    //         }
    //
    //         // this.animation.forceNavStatus(this.activeRoute,false);
    //         //this.animation.forceNavStatus(routeName,true);
    //         this.activeRoute = routeName;
    //
    //     })
    // }
    

}