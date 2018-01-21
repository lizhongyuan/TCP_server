"use strict";

const Koa = require('koa');
let app = new Koa();
let bodyParser = require('koa-bodyparser');
let config = require('config');

let router = require('./router');
let service = require('./service');
let TcpServer = service.TcpServer;
let svrRedis = service.svrRedis;

let log4js = require("./util/logger");
let logger = log4js.getLogger('tcp-server');


// todo
let db = null;
let redis = null;

app.use(bodyParser());

// app.use(router);

app.listen(3000);

setTimeout(() => {
    let tcpServer = TcpServer(redis, db, 10);
    tcpServer.listen(2500);

    logger.info("Server start.");
}, 3000);

