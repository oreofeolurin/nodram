import {Privilege} from "../helpers/Privilege";
/**
 * Created by EdgeTech on 8/31/2016.
 */

export const MODAL_TEMPLATE = `<article id="ModalView"><article id="container"><section id="main"><header><img *ngIf="modal?.backgroundImage" src="{{modal?.backgroundImage}}"><h3>{{modal?.title}}</h3></header><section>{{modal?.content}}</section><footer><button *ngFor="let action of modal?.actions" [ngClass]="setButtonClass(action)" (click)="call(action)">{{action.name}}</button></footer></section></article></article>`;

export const TOPBAR_TEMPLATE = `<article id="TopbarView"><nav id="service-lane"><div id="global-grind"><svg class="svg-grind"></svg></div></nav><nav id="profile"><div class="name">{{admin.name?.full}}</div><div id="profilePhoto" class="photo"><img *ngIf="admin.avatar" src="{{admin.avatar.thumb}}"> <img *ngIf="!admin.avatar" src="{{STATIC_DOMAIN}}/res/images/gifs/preloader.gif"></div></nav><nav id="options"><div class="settings"><i class="icon-common icon-settings"></i></div><div class="logout" (click)="onLogout()"><i class="icon-common icon-logout"></i></div></nav></article>`;

export const NAVIGATION_TEMPLATE = `<article id="NavigationView"><header><div class="app-logo"><img src="{{STATIC_DOMAIN}}/res/images/logo/logo-line-white.png"></div></header><section *ngFor="let navGroup of appNavigation.toJson()"><nav *ngIf="navGroup.level <= admin.level" routerLink="{{navGroup.slug}}" routerLinkActive="active"><i class="icon-common icon-{{navGroup.slug}}"></i> {{navGroup.name}}</nav></section></article>`;

const  TOPBAR_STYLE = `#TopbarView{height:50px;background:white;border-bottom:1px solid #eceeef;box-sizing:content-box;display:-ms-flexbox;display:flex;-ms-flex-pack:end;justify-content:flex-end;font-family:"GTHaptik-Medium"}#TopbarView nav{display:-ms-flexbox;display:flex;margin-left:20px}#TopbarView nav#options{background:#f7f7f9}#TopbarView nav#options div{cursor:pointer;padding:10px}#TopbarView nav#options div:hover{background:#eceeef}#TopbarView nav#options div:hover.logout i{background-position:-48px -24px}#TopbarView nav#options div:hover.settings i{background-position:-72px -24px}#TopbarView nav#profile .name{padding:10px}#TopbarView nav#profile .photo{padding:2.5px}#TopbarView nav#profile .photo img{width:40px;height:40px;border-radius:100%;overflow:hidden}#TopbarView .notification,#TopbarView .account{display:-ms-flexbox;display:flex;cursor:pointer}#TopbarView .notification>div,#TopbarView .account>div{margin-right:10px}#TopbarView .notification{margin-right:50px;padding-top:13px}#TopbarView .notification .number{background:#F2C300;color:white;font-size:.75rem;padding:2px 5px;text-align:center;margin-top:-10px;margin-left:-19px;height:21px;border:3px solid #fff}#TopbarView .notification .number.single,#TopbarView .notification .number.double{border-radius:100%;width:16px}#TopbarView .notification .number.tripple{border-radius:20px}#TopbarView .account{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-height:100px;height:auto;position:relative}#TopbarView .account #visible{display:-ms-flexbox;display:flex}#TopbarView .account #visible *{margin-right:5px}#TopbarView .account #visible .revealOptions{width:10px;padding-top:27px;color:#00A550;zoom:0.7}#TopbarView .account #visible .revealOptions:hover{color:#007237}#TopbarView .account #hiddenOptions{width:100%;background:#ffffff;box-shadow:1px 2px 3px #ccc;visibility:hidden}#TopbarView .account #hiddenOptions .options{padding:10px;font-size:.875rem;color:#31393A}#TopbarView .account #hiddenOptions .options i{margin-right:5px}#TopbarView .account #hiddenOptions .options:hover{background-color:#f9f9f9}`;

const MODAL_STYLE = `#ModalView{top:0;left:0;position:absolute;width:100vw;height:100vh;background:rgba(49,57,58,0.8);-ms-flex-pack:center;justify-content:center;display:none}#ModalView article#container{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}#ModalView article#container section#main{background:white;width:400px;height:200px;height:auto;box-shadow:-5px 13px 19px #485456}#ModalView article#container section#main header{overflow:hidden}#ModalView article#container section#main header img{width:calc(100% + 2px);height:auto;margin-top:-2px;margin-left:-1px}#ModalView article#container section#main header h3{font-family:"Lato";padding:20px 20px}#ModalView article#container section#main section{font-family:"Lato";padding:0px 20px}#ModalView article#container section#main footer{padding:20px;display:-ms-flexbox;display:flex;-ms-flex-pack:end;justify-content:flex-end}#ModalView article#container section#main footer button{background:none;font-family:"League Spartan";font-weight:bold;border:none;text-transform:uppercase;font-size:13px;padding:2px 0;margin:0  0 0 30px;border-bottom:2px solid #fff}#ModalView article#container section#main footer button.success{color:#2257f5}#ModalView article#container section#main footer button.success:hover{border-bottom:2px solid #2257f5}#ModalView article#container section#main footer button.neutral{color:#818a91}#ModalView article#container section#main footer button.neutral:hover{border-bottom:2px solid #31393A;color:#31393A}`;

const NAVIGATION_STYLE = `#NavigationView{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;background:#31393A;height:100%;color:#fff}#NavigationView header .app-logo{padding:20px;text-align:center}#NavigationView header .app-logo img{width:120px}#NavigationView section nav{width:100%;padding:10px;font-family:"GTHaptik-Medium";font-size:.875rem;text-transform:uppercase;cursor:pointer}#NavigationView section nav i{margin-top:-5px;margin-right:5px}#NavigationView section nav:hover{background:#252b2c}#NavigationView section nav.active{background:#00A550}
`;



export const MODAL_STYLES = [MODAL_STYLE];
export const TOPBAR_STYLES =  [TOPBAR_STYLE];
export const NAVIGATION_STYLES = [NAVIGATION_STYLE];


export const APP_NAVIGATION = [
    // {
    //     name : "Summary",
    //     navs :[]
    // },
    {
        name : "Users",
        navs :[
            {name : "Overview"},
            {name : "Passengers"},
            {name : "Drivers"},
            {name : "Owners"},
            {name : "Admin", level : Privilege.SUPER}
        ]
    },
    {
        name : "App Settings",
        navs :[
            {name : "Ride Allocation Policy"},
            {name : "Taxi Fare Calculation"},
            {name : "Self Drive Fare Calculation"},
            {name : "Card Verification Charge"}
        ]
    },
    // {
    //     name : "Vehicles",
    //     navs : [
    //         {name : "Manage"},
    //         {name : "Track"}
    //     ]
    // },
    //
    {
        name : "Transactions",
        navs : [
            {name : "Manage"}
        ]
    },
    //
    // {
    //     name : "Fares",
    //     navs : [
    //         {name : "Ongoing"},
    //         {name : "Pending Request"},
    //         {name : "Completed"}
    //     ]
    // },
    //
    // {
    //     name : "Drives",
    //     navs : [
    //         {name : "Ongoing"},
    //         {name : "Pending Request"},
    //         {name : "Completed"}
    //     ]
    // },
    //
    // {
    //     name : "Promo Codes",
    //     navs : [
    //         {name : "Manage"}
    //     ]
    // },
    //
    //
    // {
    //     name : "Ads",
    //     navs : [
    //         {name : "Manage"}
    //     ]
    // },
    //
    // {
    //     name : "Notifications",
    //     navs : [
    //         {name : "Manage"}
    //     ]
    // }

];