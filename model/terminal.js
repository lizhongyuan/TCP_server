/**
 * Created by lizhongyuan on 2017/11/30.
 */

'use strict';

const EventEmitter = require('events');
const downStreamEmitter = require('./messageEmitter');
const Promise = require("bluebird");
Promise.config({
    cancellation:true
})

let onlineTerminals = require('./lockHandlerMap');


class Terminal {

    /*
     *
     */
    constructor(deviceID) {
        this.deviceID = deviceID;
        this.rfCounter = 1;
        this.upStreamEmitter = new EventEmitter();

        this.termialCommandMap = new Map();

        this.termialCommandMap.set('HEART', this.heart);
        this.termialCommandMap.set('UNLOCK', this.unlock);
        this.termialCommandMap.set('FINDME', this.findme);
    }

    /*
     *
     */
    onTermialRetData(taskID, data) {
        //let [cmd, isSuccess] = Terminal.parseRetData(data)    // TZ use this
        let parseRet = Terminal.parseRetData(data)
        this.upStreamEmitter.emit(taskID, parseRet)
    }

    /*
     * on http api call
     * wait on upStream, and emit downStream
     */
    //onApiInvoke(body, timeout = 30) {
    waitOnUpStreamAndEmitDownStream(body, timeout = 30) {
        let taskID = genTaskID();
        let packet = new Packet(this.deviceID, taskID, body);

        return new Promise((resolve, reject) => {
            let promiseChain = Promise().resolve()
                .then(() => {
                    let timer = setTimeout(() => {
                        this.upStreamEmitter.removeListener(taskID, parseRet => {});
                        reject({errorCode:1, msg:"time out"});
                        return promiseChain.cancel();
                    }, timeout * 1000);


                    this.upStreamEmitter.once(taskID, parseRet => {
                        clearTimeout(timer);

                        // todo , for the general situation, set a class for parseRet
                        let isSuccess = parseRet[1];
                        if(isSuccess) {
                            resolve(isSuccess);
                        } else {
                            reject(isSuccess);
                        }
                    });
                    downStreamEmitter.emit(this.deviceID, packet);
                })
        })
    }


    /*
     * todo, paraArr
     */
    sendCmd2Terminal(cmd, paraArr) {
        let cmdFunc = this.termialCommandMap.get(cmd)
        if(cmdFunc) {
            return cmdFunc.apply(this, paraArr)
        } else {
            return Promise.reject('Error cmd.')
        }
    }

    /*
     * return a promise
     */
    heart() {
        let para = arguments[0];
    }

    /*
     *
     */
    static genTaskID() {
        return Match.floor(Math.random() * 0xfff);
    }

    /*
     * parse the termial ret data,
     * have made sure the data is right,
     * you can override this function
     */
    static parseRetData(data) {
        let parser;
        if (data.split(",").length === 3) {
            parser = /^RET,(\w+),(\w+)$/;
        } else {
            parser = /^RET,(\w+),(\w+),(\w+)$/;
        }
        let [, cmd, isSuccess] = parser.exec(data);
        return [cmd, isSuccess];
    }

}



