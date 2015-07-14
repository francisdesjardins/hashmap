/**
 * HashMap - utils/is unit test
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

var test = require('tape');
var is = require('../../lib/utils/is');

test('utils/is()', function (t) {
    function isOk(data1, data2, message) {
        t.ok(is(data1, data2), message);
    }

    function isNotOk(data1, data2, message) {
        t.notOk(is(data1, data2), message);
    }

    var arr = [],
        obj = {},
        date = new Date(),
        reg = /test/;

    isOk(null, null, 'null is null');
    isOk(undefined, undefined, 'undefined is undefined');
    isOk(true, true, 'true is true');
    isOk(false, false, 'false is false');
    isOk(NaN, NaN, 'NaN is NaN');
    isOk(1, 1, '1 is 1');
    isOk(1.1, 1.1, '1.1 is 1.1');
    isOk('1.1', '1.1', '"1.1" is "1.1"');
    isOk('Test', 'Test', '"Test" is "Test"');
    isOk(reg, reg, 'RegExp<r1> is RegExp<r1>');
    isOk(arr, arr, 'Array<a1> is Array<a1>');
    isOk(obj, obj, 'Object<o1> is Object<o1>');
    isOk(date, date, 'Date<d1> is Date<d1>');

    isNotOk('test', 'Test', '"test" is NOT "Test"');
    isNotOk(1, '1', '1 is NOT "1"');
    isNotOk(new Date(), new Date(), 'Date<new Date()> is NOT Date<new Date()>');
    isNotOk([], [], 'Array<[]> is NOT Array<[]>');
    isNotOk({}, {}, 'Object<{}> is NOT Object<{}>');
    isNotOk(/test/, /test/, 'RegExp</test/> is NOT RegExp</test/>');

    t.end();
});
