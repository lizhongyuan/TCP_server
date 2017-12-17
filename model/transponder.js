/**
 * Transponder, 应答器, 当终端Terminal主动发起通信时, 应答终端,
 * 应答数据以ACK开头
 * Created by lizhongyuan on 2017/12/10.
 */

"use strict";

/*
 * base class
 */
class Transponder {
    constructor(msgType) {
        this._msgType = msgType;
    }

    /*
     * generate the ack message to acknowlege the terminal.
     * this may have a time cost, like get GPS data
     * return a Promise
     */
    genAckMsgAsync(msgType, para) {
        let ackMsg;
        switch (msgType) {
            case 'SYNC':
                let syncAckMsg = Transponder.buildSyncAckMsg(para);
                ackMsg = syncAckMsg;
                return Promise.resolve(ackMsg);
                break;
            case 'LOCK':
                let lockAckMsg = Transponder.buildLockAckMsg();
                ackMsg = lockAckMsg;
                return Promise.resolve(ackMsg);
                break;
        }
    }

    static buildSyncAckMsg(value) {
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

        if (parseInt(value) == 0) {  // 当计数为0时, ack数据构造时间数据
            return ['ACK^SYNC', utcStr].join(',');
        } else {
            return 'ACK^SYNC';
        }
    }
}
