/**
 * Created by EdgeTech on 9/1/2016.
 */
import {Animation} from "../../helpers/Animation";
import {ElementRef} from "@angular/core";

declare const TweenMax : any;
declare const Snap : any;
declare const Linear : any;

export class TopbarAnimation extends Animation{

    constructor(el: ElementRef) {
        super(el);
    }

    public run(){

    }

    public launchMenu() {

        let appMenu = this.rootElement.querySelector('#app-menu');

        if (appMenu.classList.contains("closed"))
            open();
        else
            close();


        function open() {
            appMenu.classList.remove("closed");
            appMenu.classList.add("opened");
            TweenMax.to(appMenu, .5, {height: 160, ease: Linear.easeInOut});
        }

        function close() {
            appMenu.classList.remove("opened");
            appMenu.classList.add("closed");
            TweenMax.to(appMenu, .5, {height: 0, ease: Linear.easeInOut});
        }


    }
}