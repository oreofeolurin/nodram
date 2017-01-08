import {OnInit, Component, Input, ElementRef, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {RConstants} from "../../helpers/RConstants";
import {DialogModal} from "../widgets/dialog.modal";
import {Modal} from "../../models/Modal";
import {TopbarAnimation} from "./topbar.animation";
import {AppService} from "../../services/AppService";
@Component({
    selector: 'topbar-component',
    templateUrl: 'topbar.component.html',
    styleUrls: ["../../../styles/app/shared/common/topbar.css"]
})

export class TopbarComponent implements OnInit{

    private animation : TopbarAnimation;
    public STATIC_DOMAIN = RConstants.STATIC_DOMAIN;

    @Input("type")
    public toolbarType: string;

    constructor(@Inject(Router) private router: Router,
                @Inject(ElementRef) private el: ElementRef,
                @Inject(AppService) private appService: AppService){}

    public ngOnInit() {
        //set animation for this page
        this.animation = new TopbarAnimation(this.el);
    }

    public onLogout(){

        let modal = new DialogModal("Confirm Logout");
        modal.setContent("Are you sure you what to log out?");
        modal.addAction({"name" : "cancel", "type" : Modal.ACTION_NEUTRAL});
        modal.addAction({"name" : "okay", "type" : Modal.ACTION_SUCCESS, "callback" : () => {
            this.appService.logout();
            this.router.navigate(["/"]);
        }});
        console.log("call nest from tobar");

        this.appService.loadModal(modal);

    }

    public launchMenu(){
        this.animation.launchMenu();
    }
}