

import {ICommand}  from "commander";
import {Builder as DevBuilder} from "./dev/dev";
import {Builder as ProdBuilder} from "./prod/prod";
import {Builder as ProdAOTBuilder} from "./prod/prod.aot";


export class BuildTask{
    private  builder;

    constructor(private ROOT_DIR: string, command?: ICommand){
        let option = typeof command !== "undefined" ? command.opts()["prod_mode"] : null;

        if(option == null)
            this.builder = new DevBuilder(ROOT_DIR);

        else if(option == "prod"){
            this.builder = new ProdBuilder(ROOT_DIR);
        }

        else if(option == "prod-aot")
            this.builder = new ProdAOTBuilder(ROOT_DIR);

        else
            this.builder = new DevBuilder(ROOT_DIR);

        console.log()
    }


    public build(){
        return this.builder.build();
    }

}