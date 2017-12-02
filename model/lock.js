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

let activeLocks = require('./lockHandlerMap');


class Lock {

    constructor(imei) {
        this.imei = imei;
        this.upStreamEmitter = new EventEmitter();
    }
}



