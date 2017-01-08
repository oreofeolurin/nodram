import {Observable} from "rxjs";
import * as chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as spinner from '../../helpers/spinner';
import * as prompt from 'prompt';
import {Utils} from "../../helpers/Utils";

export class InitTask{

    constructor(private ROOT_DIR) {}

    public run(){
        const self = this;

        console.log(chalk.green(`------------------- INIT FRAMEWORK(web) -----------------------------`));

        return  this.initApp();
    }


    private initApp(){
        let start = new Date();

        return new Observable(observer => {

            this.promptUser().then(result => {
                spinner.start("Initiating Ream App...");
                this.createPackageJson(result);
                spinner.start("Copying files...");
                this.copyFramework();
                spinner.start("...");


                let time: number = new Date().getTime() - start.getTime();
                spinner.stop();
                observer.next(`${chalk.green('✔')} ${chalk.blue(`Initiated the Ream Framework : ${Utils.timeHuman(time)}`)}`);
                observer.complete();


            })


        })
    }


    private promptUser(){

        let defaults = {
            name : path.basename(process.cwd()),
            version: "0.0.1",
            license: "Apache-2.0",
        };

        let schema = [
            {name: "name", description : chalk.blue(`App Name: (${defaults.name})`)},
            {name: "description", description : chalk.blue(`Description: `)},
            {name: "version", description : chalk.blue(`Version: (${defaults.version})`)},
            {name: "license", description : chalk.blue(`License: (${defaults.license})`)}
        ];


        return new Promise((resolve,reject) => {

            prompt.start();
            prompt.message = "";
            prompt.delimiter = "";


            prompt.get(schema, function (err, result) {
                for (let key in result) {
                    if (result.hasOwnProperty(key)) {
                        if(defaults.hasOwnProperty(key)) {
                            if (result[key].length == 0) result[key] = defaults[key];
                        }
                        else {
                            if (result[key].length == 0) delete result[key];
                        }
                    }
                }

                return resolve(result);

            });

        })

    }

    /**
     * Get contents of default package json and merge with the packageJson passed
     * Then save as new file in the root folder
     * @param packageJson
     */
    private createPackageJson(packageJson: Object){
        let defaultPackageJson = fs.readJsonSync(path.join(this.ROOT_DIR,'/src/package.json'));

        let mergedPackageJson = Object.assign({},packageJson,defaultPackageJson);

        const destFileName = path.join(process.cwd(),"package.json");

        fs.writeJSONSync(destFileName,mergedPackageJson);

    }


    /**
     * Copy framework folder
     */
    private copyFramework(){

        const destFileName = path.join(process.cwd());
        const srcFileName = path.join(this.ROOT_DIR,"src/framework");


        fs.copySync(srcFileName , destFileName);


    }
}
