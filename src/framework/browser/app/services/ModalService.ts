/**
 * Created by EdgeTech on 8/30/2016.
 */


import {
    Inject, Injectable, Provider, ElementRef, Injector, Input, Output, ComponentRef,
    DynamicComponentLoader, ApplicationRef,
    Renderer, Type, ReflectiveInjector
} from '@angular/core';

import {Subject} from "rxjs/Rx";

declare var TweenMax: any;

@Injectable()
export class ModalService {
    private rootView: HTMLElement;
    private modalView: HTMLElement;
    private componentRef:ComponentRef;

    // Observable string sources
    private modalExitSource = new Subject<Object>();

    // Observable string streams
    public modalExitStream = this.modalExitSource.asObservable();


    constructor(//@Inject(ElementRef) private element: ElementRef,
                 @Inject(Renderer) private renderer: Renderer,
                 @Inject(Injector) private injector: Injector,
                 @Inject(DynamicComponentLoader) private dcl: DynamicComponentLoader,
                 @Inject(ApplicationRef) private appRef: ApplicationRef){

       // this.rootView = element.nativeElement;

    }

    private ensureModalElement() {
        //this.modalView = this.rootView.querySelector("#ModalView");

        if(this.modalView == null) {
            this.modalView = this.renderer.createElement(this.rootView, "article", null);
            this.modalView.setAttribute("id", "ModalView");

            //create remove modal
            let removeModal = this.renderer.createElement(this.modalView, "div", null);
            removeModal.setAttribute("id", "removeModal");
            removeModal.innerHTML = `<i class="ion-ios-close-empty"></i>`;

            //set click event;
            removeModal.onclick = () => this.removeModal();

        }


        var modalContent = this.modalView.querySelector("#ModalContent");

        if(modalContent == null) {
            modalContent = this.renderer.createElement(this.modalView, "section", null);
            modalContent.setAttribute("id", "ModalContent");
        }


    }

    private makeVisible(visible? : boolean){
        let state;
        if(typeof visible === "undefined" || visible)
            state = "visible";
        else
            state = "hidden";
        TweenMax.set(this.modalView,{visibility: state});
    }


    public notifyExit(tag, meta){
        this.modalExitSource.next({tag : tag, meta : meta});
    }

    public removeModal(makeVisible? :boolean) {

        if (this.componentRef) {
            this.componentRef.destroy();

            if(typeof makeVisible == "undefined" && !makeVisible)
                this.makeVisible(false);
        }
    }


    public load(component:Type, data?:Object, tag?: String) {

        //Cleanup the old component
        this.removeModal(true);

        //ensureModal
        this.ensureModalElement();

        //make visible
        this.makeVisible();


        //Set providers
        var providers = [];

        if(typeof data !== "undefined"){
            for (let key in data) {
                providers.push(new Provider(key, {useValue: data[key]}));
            }
        }

        var injector = ReflectiveInjector.resolveAndCreate(providers, this.injector);


        this.dcl.loadAsRoot(component, "#ModalContent", injector).then((compRef:ComponentRef) => {

            //lets suscribe to the openModal event
            (<any>this.appRef)._loadComponent(compRef);


            //store the component
            this.componentRef = compRef;

            //clean things up
            compRef.onDestroy(() => {
                (<any>this.appRef)._unloadComponent(compRef);
            });

            return compRef;
        });

        // modal-component
    }

}