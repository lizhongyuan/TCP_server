/**
 * Created by lizhongyuan on 2017/11/30.
 */

"use strict"

const os = require('os');

/*
 * 获取本机ip
 */
exports.getInnerHost = () => {
    let IPv4
    let netArr;
    if (os.networkInterfaces().en0) {
        netArr = os.networkInterfaces().en0;
    } else {
        netArr = os.networkInterfaces().eth0;
    }
    for( let i = 0; i < netArr.length; i++ )
    {
        if( netArr[i].family == 'IPv4' )
        {
            IPv4 = netArr[i].address;
        }
    }

    return IPv4
}
