/**
 * Created by lizhongyuan on 17/3/11.
 */

'use strict'

const sprintf = require('sprintf-js').sprintf

/*
 * base class
 */
class Transponder {
    constructor(commandCode) {
        this.commandCode = commandCode;
    }

    buildAckData() {
        return Promise.resolve(`ACK^${this.commandCode}`);
    }
}

var locaTransponder = new Transponder('LOCA'); /* ACK^LOCA */

class SYNCTransponder extends Transponder {
    constructor(commandCode) {
        super(commandCode);
    }

    //ack(para) /* 0 - fff */ {
    buildAckData(para) /* 0 - fff */ {
        let now = new Date();
        let utcStr = sprintf(
            '%02d%02d%02d%02d%02d%02d',
            now.getUTCFullYear() % 100,
            now.getUTCMonth() + 1,
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );

        if (parseInt(para) == 0) {
            return new Promise( (resolve, reject) => {
                super.buildAckData()
                    .then( (value) => {
                        resolve([value, utcStr].join(','));
                    })
                    .catch( (error) => {})
            })
        }
    else return super.buildAckData();
    }
}
var syncTransponder = new SYNCTransponder('SYNC'); /* ACK^SYNC[,UTC] */


class AIRTransponder extends Transponder {
    constructor(commandCode) {
        super(commandCode);
    }
    buildAckData() {
        Promise.resolve();
    }
}
/* AIR 包不需要回复 */

class SUDOTransponder extends Transponder {
    constructor(commandCode) {
        super(commandCode);
    }

    buildAckData(para) /* center number */ {
        return new Promise( (resolve, reject) => {
                super.buildAckData().then( (value) => {
                resolve([value, 1].join(','));
    }).catch( (error) => {
        });
    });
    }
}

var sudoTransponder = new SUDOTransponder('SUDO'); /* ACK^SUDO,1 */

var lockTransponder = new Transponder('LOCK'); /* ACK^LOCK */

class BTSSIDTransponder extends Transponder {
    constructor(commandCode) {
        super(commandCode);
    }

    // TODO: retrieve SSID from database
    buildAckData(para) {
        return new Promise( (resolve, reject) => {
            super.buildAckData()
                .then( (value) => {
                    resolve([value, "BK3431S"].join(','));
                })
                .catch( (error) => {
                })
        });
    }
}

var btssidTransponder = new BTSSIDTransponder('BTSSID');  /* ACK^BTSSID,BK3431S */

var transponderMap = new Map();
transponderMap.set('LOCA', locaTransponder);
transponderMap.set('SYNC', syncTransponder);
transponderMap.set('SUDO', sudoTransponder);
transponderMap.set('LOCK', lockTransponder);
transponderMap.set('BTSSID', btssidTransponder);


module.exports.lockAckMap = transponderMap;


