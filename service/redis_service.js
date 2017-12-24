/**
 * Created by svenlee on 17/12/24.
 */

const IORedis = require("ioredis");

IORedis.Promise.onPossiblyUnhandledRejection(err => {
    console.log('onPossiblyUnhandledRejection:', + JSON.stringify(err));
})


class TerminalIORedis {
    constructor() {
         this.instance = {
             lcServerRedis = new IORedis({
                 'host':'',
                 'port':'',
                 'password':''
             }),
             lcThreadRedis = new IORedis({
                 'host':'',
                 'port':'',
                 'password':''
             })
         }
    }

    getInstance() {
        return this.instance;
    }
}