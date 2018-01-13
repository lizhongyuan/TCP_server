/**
 * Created by svenlee on 18/1/13.
 */

const pm2 = require('pm2');
const Promise = require('bluebird');
const pm2Async = Promise.promisifyAll(require('pm2'));

console.log("....");

pm2Async.listAsync()
    .then(list => {
        console.log(list.length)
    }, err => {
        console.log(JSON.stringify(err));
    })


/*
pm2.list((err, list) => {
    console.log(list.length);
})
*/
