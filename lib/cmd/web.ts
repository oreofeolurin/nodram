import {BuildTask} from "../tasks/build/index";
import {WatchTask} from "../tasks/watch/index";
import * as chalk from 'chalk';
import * as program from 'commander';
import {InitTask} from "../tasks/init/InitTask";

const VERSION = "0.0.1";

export class APP{

    constructor(private ROOT_DIR){}

    public start(){

        //set version
        program.version(VERSION);

        this.createInitCommand();
        this.createBuildCommand();
        this.createWatchCommand();

        program.parse(process.argv);
  
    }



    private createInitCommand(){

        program.command("init")
            .alias("-i")
            .description('Initiate the Ream Framework')
            .action(()=>{
                try{
                    let task =  new InitTask(this.ROOT_DIR);

                    task.run().subscribe(
                        data => {console.info(data);},
                        err => {throw new Error(err)},
                        () => {console.log(chalk.green('✔'), chalk.green('Done.'))}
                    );
                }catch(err){
                    console.log(chalk.bold.red(`✖ Compile error: `) + chalk.red(err));
                }

            });



    }


    private createWatchCommand(){
        const ROOT_DIR= this.ROOT_DIR;

        program.command("watch")
            .alias("-w")
            .description('run a reamn watch task [sass, ts]')
            .action(function(options){
                try{

                    let watcher =  new WatchTask();
                    //lets start watcher
                    watcher.watch().subscribe(
                        data => {console.info(data);},
                        err => {throw new Error(err)},
                        () => {
                            console.log(chalk.green('✔'), chalk.green('Done.'));
                        })

                }catch(err){
                    console.log(chalk.bold.red(`✖ Compile error: `) + chalk.red(err));
                }




            });


    }


    private createBuildCommand() {
        const ROOT_DIR = this.ROOT_DIR;


        program.command("build")
            .alias("-b")
            .description('run a ream build task [sass, ts]')
            .option('-m, --prod_mode [prod_mode]', 'Which build mode to use')
            .action(function(options){
                try{
                    let builder =  new BuildTask(ROOT_DIR,options);

                    builder.build().subscribe(
                        data => {console.info(data);},
                        err => {throw new Error(err)},
                        () => {console.log(chalk.green('✔'), chalk.green('Done.'))}
                    );
                }catch(err){
                    console.log(chalk.bold.red(`✖ Compile error: `) + chalk.red(err));
                }


                //   co(function *() {
                //       var username = yield prompt('username: ');
                //       var password = yield prompt.password('password: ');

                // console.log('user: %s pass: %s file: %s',username, password, file);
                //   })

            });

    }


}