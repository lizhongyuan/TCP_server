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
        this._deviceID = deviceID;          // 设备ID
        this._msgID = msgID;                // 消息ID
        this._data = data;                  // 实际有用的数据
        if (/^RET,.+/.test(this._data)) {
            this._msgType = 'ret';
        } else {
            this._msgType = 'positive';
        }
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
        let proID = re[1];                  // project ID
        let deviceID = re[2];               // device ID
        let msgID = parseInt(re[3],16);     // message ID
        let dataLen = parseInt(re[4], 16);  // data length
        let data = re[5];                   // data
        if (proID != Packet.proID()) {
            return undefined;
        }
        if (dataLen != data.length) {
            return undefined;
        }

        return new Packet(deviceID, msgID, data);
    }
}

module.exports = Packet;

