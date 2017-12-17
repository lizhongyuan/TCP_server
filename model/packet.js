/**
 * Created by lizhongyuan on 17/3/11.
 */

'use strict';

let sprintf = require('sprintf-js').sprintf;
let Promise = require('bluebird');
Promise.config({
    cancellation:true
});


class Packet {

    constructor (deviceID, msgID, data) {
        this._deviceID = deviceID;
        this._msgID = msgID;
        this._data = data;
        // todo: you can design your own dispatcher
        this._dispatcher = /^(\w+)(?::([a-zA-Z0-9,+]+))?/
        let dataRe = this._dispatcher.exec(this._data);
        this._action = dataRe[1];
    }

    static proID() {
        return 'demo';
    }

    static terminator() {
        return '$';
    }

    static genPacketByRawMsg(rawMsg) {
        // re[4]是re[5]的length
        let validator = /^(\w{4})#(\d{15})#(\w{4})#(\w{4})#([A-Za-z0-9:;,.+-]+)[$]$/;
        let re = validator.exec(rawMsg);
        if (re == null) {
            return undefined;
        }
        let proID = re[1];
        let deviceID = re[2];
        let msgID = parseInt(re[3],16);
        let dataLen = parseInt(re[4], 16);
        let data = re[5];
        if (proID != Packet.proID()) {
            return undefined;
        }
        if (dataLen != data.length) {
            return undefined;
        }

        return new Packet(deviceID, msgID, data);
    }
}

