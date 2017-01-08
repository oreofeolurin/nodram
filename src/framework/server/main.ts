import {WebServer} from './server';
import {logger} from "./helpers";


//create tte web server
const WEB_SERVER = createServer();

//set event on the process
process.on('SIGINT', shutdown);

//Lets create the express web server
function createServer(){
    //start express webServer
    // tip : move into web/WebServer.ts now and view what function start is doing
    logger.info('Starting express web server');
    let webServer = new WebServer().start();

    //set port to listen at
    webServer.listen(process.env.PORT, onListen);

    function onListen() {
        let port = webServer.address().port;
        logger.info('Web server listening at http://localhost:%s', port);
    }

    return webServer;
}


function shutdown() {
    logger.info("Shutting down application...");
    WEB_SERVER.close(function () {
        process.exit();
    });
}