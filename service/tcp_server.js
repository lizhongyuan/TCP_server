/**
 * Created by lizhongyuan on 2017/11/29.
 */

let Promise = require("bluebird");
Promise.config({
    cancellation:true
})

let Packet = require("../model/packet");
let Terminal = require("../model/terminal");
let messageEmitter = require('../model/messageEmitter');
let net = require("net");
let os = require("../util/os")
let log4js = require("../util/logger");
let logger = log4js.getLogger('tcp-server');

let downStreamEmitter = messageEmitter.downStreamEmitter;


/*
 * return a tcp server
 */ 
// todo: change to a class
function TcpServer(redisInstances, db, timeout) {

    return net.createServer( socket => {

        // 服务器收到数据data时的
        socket.on("data", rawData => {
						console.log(rawData.toString());
						logger.info(rawData.toString());

            // 1. parse the terminal raw data
            let curPacket = Packet.genPacketByRawMsg(rawData);
            if (!curPacket) { return; }

            // 2. Packet module ack the terminal
            curPacket.genAckMsgAsync()
                .then(ackData => {
                    let res = sendMsg2Terminal(ackData);
                    if (res) {
                        // todo log
                    } else {
                        // todo log
                    }
                })

            // 3. deal with the terminal upload data
            lockDataHandler(redisInstances, db, curPacket);

            /*
             * terminal upload data or terminal answer the server
             */
            socket.emit("ack_lock_finish", curPacket);
        });

        socket.once("ack_lock_finish", buildLongConnection)

        socket.on("ack_lock_finish", onAckTerminalFinish)

        // 只进行一次, 建立新的[长连接, 设备(lock), 业务Emitter] <--> imei 映射
        function buildLongConnection(packet) {

            let deviceID = packet._deviceID
            // 登记设备, 如果有, 则写入onlineTerminalMap
            Terminal.add2OnlineTerminalMap(deviceID);


            /* 重新监听外部 CLI 事件 , 当侦听到imei的信号后，由sendMsg2Lock */
            downStreamEmitter.removeAllListeners();
            downStreamEmitter.on(deviceID, sendMsg2Terminal);
        }

        /*
         * 针对终端不同的数据，进行业务处理，
         * 包括对redis, db, logger等等的业务操作
         */
        function lockDataHandler(redisInstances, db, packet, deviceID) {
            switch(packet.action) {
                case 'SYNC':
                    packetSYNCHandler(redisInstances, db, packet, deviceID);
                    break;
                case 'LOCA':
                    packetLOCAHandler(redisInstances, db, packet, deviceID);
                    break;
            }
        }

        /*
         * SYNC心跳包数据处理, 当收到心跳包时, 在redis中存入服务器内网地址和pm2的instance
         */
        function packetSYNCHandler(redisInstances, db, packet, deviceID) {
            let innerHost = os.getInnerHost();  // get the inner host, to
            // 1. redis
            // 长连接保存在哪个服务器
            redisInstances.lcServerRedis.set("ter:lc" + deviceID, '127.0.0.1')
            // 长连接保存在哪个进程
            redisInstances.lcThreadRedis.set("ter:lc:pid:" + deviceID, process.env.NODE_APP_INSTANCE)

            // 2. db
            /*
             *db.query().then(res => { ... })
             */

            // 3. logger
        }

        function packetLOCAHandler(redisInstances, db, packet, deviceID) {
            /* db, redis, logger*/
        }

        function onAckTerminalFinish(packet) {
            let deviceID = packet.deviceID;
            let terminalHandler = Terminal.getOnlineTerminalHandler(deviceID);

            if (packet._msgType == 'ret') {
                terminalHandler.emitL
            }
        }

        function sendMsg2Terminal(data) {
            return socket.write(data);
        }

    });
}


module.exports = TcpServer;
