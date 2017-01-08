/**
 * Created by EdgeTech on 9/2/2016.
 */
import {Utils} from "../helpers/Utils";
import {Privilege} from "../helpers/Privilege";


export class Navigation{
    private raw: Array<Object>;

    public navGroups: Map<string,NavGroup> = new Map<string,NavGroup>();

    constructor(data: Array<Object>){
        this.raw = [];

        this.buildNavGroups(data);

    }

    public addNavGroup(group: NavGroup){
        this.navGroups = this.navGroups.set(group.slug,group);
        this.raw.push(group.toJson());
    }

    public getNavGroup(key: string){
        return this.navGroups.get(key);
    }

    public toJson(){
        return this.raw
    }

    private buildNavGroups(groups$: Array<Object>){
        for (let group$ of groups$)
            this.addNavGroup(new NavGroup(group$));
    }
}


class Nav {
    private raw: Object;
    public name: string;
    public slug: string;
    public level: Privilege;

    constructor(data: Object){
        this.name = data["name"];
        this.slug = Utils.wordToSlug(data["name"]);
        this.level = data["level"] || Privilege.NOMINAL;

        //update raw
        this.raw = data;
        this.raw["slug"] = this.slug;
        this.raw["level"] = this.level;
    }

    public toJson(){
        return this.raw;
    }

}

export class NavGroup{
    private raw: Object;
    public name: string;
    public slug: string;
    public navs: Map<string,Nav> = new Map<string,Nav>();
    public level: Privilege;


    constructor(data: Object){
        this.name = data["name"];
        this.slug = Utils.wordToSlug(data["name"]);
        this.level =  data["level"] || Privilege.NOMINAL;

        //update raw
        this.raw = Object.assign({},data);
        this.raw["slug"] = this.slug;
        this.raw["level"] = this.level;
        this.raw["navs"] = [];

        this.buildNavs(data["navs"]);

    }

    public addNav(nav: Nav){
        this.navs = this.navs.set(nav.slug,nav);
        this.raw["navs"].push(nav.toJson());
    }


    private buildNavs(navs$: Array<Object>){

        for (let nav$ of navs$)
            this.addNav(new Nav(nav$));


    }

    public toJson(){
        return this.raw;
    }
    
}