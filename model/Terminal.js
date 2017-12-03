/**
 * Created by lizhongyuan on 2017/11/30.
 */

'use strict'

const EventEmitter = require('events');
const downStreamEmitter = require('./MessageEmitter');
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
     * parse the termial ret data,
     * have made sure the data is right
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



