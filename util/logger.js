

"use strict";

const log4js = require('log4js');   // todo 更新log4js 2.x版本
const log4jsConfig = require('../log4js.json');
log4js.configure(log4jsConfig, {cwd:'./logs'});
module.exports = log4js;
