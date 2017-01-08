/**
 * Created by EdgeTech on 8/31/2016.
 */


export interface ModalAction{
    name : string,
    type:  number,
    callback?: Function
}

export class Modal{
    public title;
    public content : string;
    public actions : Array<ModalAction> = [];
    public backgroundImage : string;

    public static ACTION_NEUTRAL = 0;
    public static ACTION_SUCCESS = 1;
    public static ACTION_ERROR = 1;

    constructor(title: string){
        this.title = title;
    }

    public setContent(content: string){
        this.content = content;
    }

    public addAction(action: ModalAction){
        this.actions.push(action);
    }

    public setBackgroundImage(url: string){
        this.backgroundImage = url;
    }
}