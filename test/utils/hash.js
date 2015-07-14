/**
 * HashMap - utils/hash unit test
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

var test = require('tape');
var hash = require('../../lib/utils/hash');

test('utils/hash()', function (t) {
    var hashedData = null,
        obj = {};

    function hashMe(data) {
        hashedData = hash(data);

        return hashedData;
    }
    function isDeepEqual(hash1, hash2, message) {
        t.deepEqual(hash1, hash2, message);
    }

    // should hash primitives accurately
    isDeepEqual(hashMe(null), hashedData, 'null is "' + hashedData + '"');
    isDeepEqual(hashMe(undefined), hashedData, 'undefined is "' + hashedData + '"');
    isDeepEqual(hashMe(true), hashedData, 'true is "' + hashedData + '"');
    isDeepEqual(hashMe(false), hashedData, 'false is "' + hashedData + '"');
    isDeepEqual(hashMe(NaN), hashedData, 'NaN is "' + hashedData + '"');
    isDeepEqual(hashMe(1), hashedData, '1 is "' + hashedData + '"');
    isDeepEqual(hashMe(1.1), hashedData, '1.1 is "' + hashedData + '"');
    isDeepEqual(hashMe('1.1'), hashedData, '"1.1" is "' + hashedData + '"');
    isDeepEqual(hashMe('Test'), hashedData, '"Test" is "' + hashedData + '"');

    // should hash objects with primitive representation accurately
    isDeepEqual(hashMe(/test/), hashedData, '/test/ is "' + hashedData + '"');
    isDeepEqual(hashMe(new Date(Date.parse('Fri, 15 Aug 1986 15:05:00 GMT'))), hashedData, 'new Date(Date.parse(\'Fri, 15 Aug 1986 15:05:00 GMT\')) is "' + hashedData + '"');

    // should hash arrays accurately
    isDeepEqual(hashMe([]), hashedData, '[] is "' + hashedData + '"');
    isDeepEqual(hashMe([1, 2, 3]), hashedData, '[1, 2, 3] is "' + hashedData + '"');

    // should hash unrecognized objects accurately
    isDeepEqual(hashMe({}), hashedData, '{} is "' + hashedData + '"');
    isDeepEqual(hashMe(Array), hashedData, 'Array is "' + hashedData + '"');
    isDeepEqual(hashMe(hash), hashedData, 'hash is "' + hashedData + '"');

    // should not add any iterable property to objects
    hash(obj);
    t.deepEqual(obj, {}, 'Should not add any iterable property to objects');

    // end of test
    t.end();
});
