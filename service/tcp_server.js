/**
 * Created by lizhongyuan on 2017/11/29.
 */

var Promise = require("bluebird");
Promise.config({
    cancellation:true
})

var Packet = require("./model/packet");;
var net = require("net");
var os = require("./os")


/*
 * return a tcp server
 */ 
// todo: change to a class
module.exports.TcpServer = (redis, db, timeout) => {

    let curDeviceID;

    return net.createServer( socket => {

        // 服务器收到数据data时的
        socket.on("data", data => {

            //
            let imei = packet.imei;
            let packetHandler = LockHandler.getLockHandler(imei);

            socket.emit("ack_lock_finish", packetHandler);
        });

        socket.once("ack_lock_finish", buildLongConnection)

        socket.on("ack_lock_finish", OnLockData)
    });


    function OnLockData(packet) {
        let imei = packet.imei;
        let lockHandler = lockHandler.getH
    }



    // 只进行一次, 建立新的[长连接, 设备(lock), 业务Emitter] <--> imei 映射
    let buildLongConnection = (packet) => {

        // 登记设备, 如果有, 则写入_activeLock
        let imei = packet.imei;
        socket.imei = imei;
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
}
