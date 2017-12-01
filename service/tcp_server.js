/**
 * Created by lizhongyuan on 2017/11/29.
 */

const Promise = require("bluebird");
Promise.config({
    cancellation:true
})

const Packet = require("./model/packet");;
const net = require("net");
const os = require("./os")


module.exports.createServer = (redis, db, timeout) => {
    return net.createServer((client) => {

        // 服务器收到数据data时的
        client.on("data", data => {
            //
            let imei = packet.imei;
            let lockHandler = LockHandler.getLockHandler(imei);

            client.emit("ack_lock_finish", packetHandler);
        });

        client.once("ack_lock_finish", )

        client.on("ack_lock_finish", )
    })
}



// 只进行一次, 建立新的[长连接, 设备(lock), 业务Emitter] <--> imei 映射
let buildLongConnection = (packet) => {

    // 登记设备, 如果有, 则写入_activeLock
    let imei = packet.imei;
    client.imei = imei;
    LockHandler.add(imei);

    setSaveElecMode(imei)
        .then(res => {
            logger.info(res)
        }, err => {
            logger.debug(JSON.stringify(err))
        })

    /* 重新监听外部 CLI 事件 , 当侦听到imei的信号后，由sendMsg2Lock */
    downStreamEmitter.removeAllListeners(imei);
    downStreamEmitter.on(imei, sendMsg2Lock);
}

