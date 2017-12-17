/**
 * Created by lizhongyuan on 2017/12/10.
 */

'use strict';

let str = 'a';

function test(str) {
    switch (str) {
        case 'a':
            return 1;
        case 'b':
            return 2;
        case 'c':
            return 3;
    }
}

console.log(test('b'))
