import {RConstants} from "./RConstants";
//import {isBrowser} from "angular2-universal/browser";

/**
 * Created by EdgeTech on 3/15/2016.
 */

const STORAGE = typeof localStorage !== "undefined" ? localStorage : null;

export class Store{

    /**
     * append to an array in the store
     */

    public static removeFromStore(key: string,data: any): boolean{

        if(STORAGE == null) return false;

        let store;
        let rawStore = STORAGE.getItem(RConstants.STORE_KEY);

        //parse if items exist
        if(rawStore) {
            store = JSON.parse(rawStore);

            //lets remove the data
            store[key] = store[key].filter((value) =>  value !== data );


            var string = JSON.stringify(store);
            STORAGE.setItem(RConstants.STORE_KEY, string);

            return true;
        }

        return false;

    }


    /**
     * append to an array in the store
     */

    public static appendToStore(key: string,data: any): boolean{

        if(STORAGE == null) return false;

        let store;
        let rawStore = STORAGE.getItem(RConstants.STORE_KEY);

        //parse if items exist
        if(rawStore){
            store = JSON.parse(rawStore);

            store[key] = store[key] || new Array();

            if(!store[key].includes(key))
                store[key].push(data);

            var string = JSON.stringify(store);
            STORAGE.setItem(RConstants.STORE_KEY,string);

            return true;
        }

        return false;

    }


    /**
     * append to an array in the store
     */

    public static getFromStore(key: string): any{

        if(STORAGE == null) return null;

        let store;
        let rawStore = STORAGE.getItem(RConstants.STORE_KEY);

        //parse if items exist
        if(rawStore) {
            store = JSON.parse(rawStore);
            return store[key];
        }

        return false;
    }

    public static saveToStore(key: string,data: any): boolean{

        if(STORAGE == null) return false;

        let store;
        let rawStore = STORAGE.getItem(RConstants.STORE_KEY);

        //parse if items exist
        if(rawStore)
            store = JSON.parse(rawStore);
        else
            store = {};

        store[key] = data;

        var string = JSON.stringify(store);

        STORAGE.setItem(RConstants.STORE_KEY,string);

        return true;
    }


    public static deleteStore(key: string): boolean{

        if(STORAGE == null) return false;

        STORAGE.removeItem(key);
        return true;
    }

}