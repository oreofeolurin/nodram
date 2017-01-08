/**
 * Created by EdgeTech on 7/6/2016.
 */
import {Component, OnInit, Inject, ElementRef} from '@angular/core';


import {RConstants} from "../helpers/RConstants";
import {LoginAnimation} from "./login.animation";
import {FormBuilder, Validators, FormGroup, FormControl} from "@angular/forms";
import {AuthService} from "../services/AuthService";
import {RValidators} from "../helpers/RValidators";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {RError} from "../helpers/RError";
import {RResponse} from "../helpers/RResponse";


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ["../../styles/app/landing/login.css"],
    //template: "LOGIN_TEMPLATE",
   // template: LOGIN_TEMPLATE,
   // styles: LOGIN_STYLES
})

export class LoginComponent implements OnInit{

    public STATIC_DOMAIN = RConstants.STATIC_DOMAIN;

    public error = null;

    public otpError = null;

    private animation : LoginAnimation;

    public isGrinding = false;

    public loginForm: FormGroup;

    public otpControl: FormControl;

    constructor(
        @Inject(AuthService) private authService: AuthService,
        @Inject(Router) private router: Router,
        @Inject(FormBuilder) private formBuilder: FormBuilder,
        @Inject(ElementRef) private el: ElementRef,
        @Inject(Title) private titleService: Title ){

     //   this.setTitle("Rider: Login");



    }


    public ngOnInit() {

        //set animation for this page
        this.animation = new LoginAnimation(this.el);


        this.loginForm = this.formBuilder.group({
            email: ['', RValidators.email],
            password: ['', Validators.minLength(8)],
        });

        this.otpControl =  new FormControl('',RValidators.OTP);


    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }



    public onSubmit() {

        if(this.loginForm.valid) {
            this.isGrinding = true;
            this.animation.drawHeroGrinding();
            this.fireToAPI();
        }
        else
            this.error = "Please fill in valid values";

    }

    private fireToAPI(){

         this.authService.login(this.loginForm.value).then((responseCode) =>{
            if (this.authService.isLoggedIn){
                let redirectUrl = this.authService.redirectUrl || '/dashboard';
                this.router.navigate([redirectUrl]);
            }

        }).catch(err => this.handleError(err) );


    }

    
    public resendEmail() {

        this.isGrinding = true;
        this.animation.drawGrinding('emailNotSent');

        this.authService.sendEmailConfirmation(this.loginForm.value.email).then( response => {
            done();

            if (response.code === RResponse.SUCCESS && response.body["emailSent"] === true){
                this.animation.revealStep("emailResent");
            }

            else
                this.animation.revealStep("issh");
            
        }).catch(err => done(err));


        let done = (err?)=>{
            this.isGrinding =  false;
            this.animation.drawGrindingDone('emailNotSent');

            if(err) console.log(err);
        }

    }


    public startAgain (){
            this.animation.revealStep("loginForm");
            this.error = null;
            this.loginForm.reset();
    }

    
    public confirmAccount(){

        this.isGrinding = true;
        this.animation.drawGrinding('emailResent');

        this.authService.confirmAccount(this.loginForm.value.email,this.otpControl.value).then( response => {

            done();

            if (response.code === RResponse.SUCCESS ){
                this.animation.revealStep("accountConfirmed");
            }



        }).catch(err => done(err));


        var done = (err?)=>{
            this.isGrinding =  false;
            this.animation.drawGrindingDone('emailResent');

            if(err) {

                let body = JSON.parse(err["_body"]);

                if (body.code === RError.UNKNOWN_USER.code) {
                    this.otpError = "Invalid OTP, please try again."
                    this.otpControl.reset();
                }

                else {
                    this.animation.revealStep("issh");
                }

            }


        }
        
    }

    public openConfirm(){
        this.animation.revealStep("emailResent");
    }

    public openEmailNotSent(){
        this.otpControl.reset();
        this.otpError  = null;
        this.animation.revealStep("emailNotSent");
    }

    private handleError(err: RError){
        this.isGrinding = false;


        switch(err.code) {
            case RError.INVALID_PASSWORD.code:
            case RError.ACCOUNT_UNAUTHORIZED.code:
                this.error = "Invalid email and password combination";
                this.loginForm.reset();
                break;
            case RError.INTERNET_UNAVAILABLE.code:
                this.error = "Please check your internet";
                break;
            case RError.ACCOUNT_UNCONFIRMED.code:
                this.animation.revealStep("emailNotSent");
                break;
            default:
                this.error = "An unexpected error has occurred, please try again";
                break;
        }

        this.animation.drawHeroGrindingDone();


    }

}
