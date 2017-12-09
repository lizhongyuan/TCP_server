"use strict"

var Koa = require('koa');
var app = new Koa();
var bodyParser = require('koa-bodyparser');
var config = require('config');

var router = require('./router');
var service = require('./service');
var TcpServer = service.TcpServer;
var svrRedis = service.svrRedis;

app.use(bodyParser());

// app.use(router);

app.listen(3000);

setTimeout(() => {
    let tcpServer = TcpServer.createServer(null, null, 10);
    tcpServer.listen(9603);

    console.log("Server start.");
}, 3000);

