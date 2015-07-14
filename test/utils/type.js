/**
 * HashMap - utils/type unit test
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

var test = require('tape');
var typeOf = require('../../lib/utils/type');

test('utils/type()', function (t) {
    function check(data, type, what) {
        t.equal(typeOf(data), type, what);
    }

    // should detect types accurately
    check(null, 'null', 'null is "null"');
    check(undefined, 'undefined', 'undefined is "undefined"');
    check(true, 'boolean', 'true is "boolean"');
    check(false, 'boolean', 'false is "boolean"');
    check(NaN, 'nan', 'NaN is "nan"');
    check(1, 'number', '1 is "number"');
    check(1.1, 'number', '1.1 is "number"');
    check('1.1', 'string', '"1.1" is "string"');
    check('Test', 'string', '"Test" is "string"');
    check(/test/, 'regexp', '/test/ is "regexp"');
    check(new Date(), 'date', 'new Date() is "date"');
    check([], 'array', '[] is "array"');
    check({}, 'object', '{} is "object"');
    check(Array, 'function', 'Array is "function"');

    t.end();
});
