/**
 * Created by EdgeTech on 3/6/2016.
 */
import {ElementRef} from "@angular/core";

declare const TweenMax : any;
declare const Snap : any;

export abstract class Animation{
    protected rootElement: HTMLElement;

    constructor(protected el: ElementRef) {
        this.rootElement = this.el.nativeElement;
        this.run();
    }

    public abstract run();


    public drawGrinding(grind: string,inverse?: boolean){
        let color = inverse ? "primary" : "white";
        let svg = this.rootElement.querySelector('#' + grind + ' .svg-grind');

        //make visible
        TweenMax.set(svg, {display:"inline-block"});

        // create snap object
        let Stage  = Snap(svg);

        //Empty Stage
        Stage.clear();

        Stage.attr({viewBox : "0 0 16 16",width : 16,height : 16});

        let loader = Stage.group().attr({"class" : "qp-circular-loader"});

        loader.path("M 8,1.125 A 6.875,6.875 0 1 1 1.125,8").attr({
            fill:"none",
            "class" : `qp-circular-loader-path-${color}`,
            strokeWidth:"2.25",
            //stroke  : "#fff",
            strokeLinecap : "round",
        })

    }

    public drawGrindingDone(grind: string, hasParent?: boolean){
        let element;

        if(!hasParent)
            element = this.rootElement.querySelector('#' + grind + ' .svg-grind');
        else
            element = this.rootElement.querySelector('#' + grind);

        TweenMax.set(element, {display:"none"});
    }



}
