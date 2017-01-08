import {Animation} from "../helpers/Animation";
import {ElementRef} from "@angular/core";
//import {isBrowser} from "angular2-universal";

declare const TweenMax : any;
declare const $ : any;

export class LoginAnimation extends Animation{

    constructor(el: ElementRef) {
        super(el);

    }

    public run(){
        if(typeof document !== "undefined")
            this.reveal();
    }


    public reveal(){
        let asides = this.rootElement.querySelectorAll("aside");

        TweenMax.from(asides[0],1,{opacity:0, y:-50});
        TweenMax.from(asides[1],1,{opacity:0, y:50});

    }

    public revealStep(id: string){
        var steps = this.rootElement.querySelectorAll("aside .step:not(#" +id + ")");
        var focusStep= this.rootElement.querySelector("aside .step#" + id);

        TweenMax.set(focusStep,{y:50});
        TweenMax.to(steps,.25,{opacity:0, display:"none", y:-50});
        TweenMax.to(focusStep,.5,{opacity:1, display:"block", y:0, delay :.25});

    }



    public showError():void{

        var element = $("form >  .error");

        TweenMax.set(element,{display:"block"});
        TweenMax.to(element, 0.5, { opacity: 1, marginTop: -5 });
    }

    public drawHeroGrinding(){
        var glyphicon = this.rootElement.querySelectorAll('form .submit .glyphicon');
        TweenMax.set(glyphicon,{display : "none"});
        
        this.drawGrinding("loginForm");
    }


    public drawHeroGrindingDone(){
        var svg = this.rootElement.querySelector("section#hero .svg-grind");
        var glyphicon = this.rootElement.querySelector("form .submit .glyphicon");

        TweenMax.set(svg,{display : "none"});
        TweenMax.set(glyphicon,{display : "inline-block"});
    }
}