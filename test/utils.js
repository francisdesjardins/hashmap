'use strict';

var expect = require('chai').expect,
    utils = {};

utils.hash = require('../lib/utils/hash');
utils.is = require('../lib/utils/is');
utils.type = require('../lib/utils/type');

describe('utils', function () {
    describe('utils.hash()', function () {
        function check(data, hash) {
            expect(utils.hash(data)).to.equal(hash);
        }

        it('should hash primitives accurately', function () {
            check(null, 'null');
            check(undefined, 'undefined');
            check(true, 'true');
            check(false, 'false');
            check(NaN, 'NaN');
            check(1, '1');
            check(1.1, '1.1');
            check('1.1', '♠1.1');
            check('Test', '♠Test');
        });

        it('should hash objects with primitive representation accurately', function () {
            check(/test/, '/test/');
            check(new Date(Date.parse('Fri, 15 Aug 1986 15:05:00 GMT')), '♣524502300000');
        });

        it('should hash arrays accurately', function () {
            check([], '♥');
            check([1, 2, 3], '♥1⁞2⁞3');
        });

        it('should hash unrecognized objects accurately', function () {
            check({}, '♦7');
            check(Array, '♦8');
            check(utils, '♦9');
        });

        it('should not add any iterable property to objects', function () {
            var obj = {};
            utils.hash(obj);
            expect(obj).to.be.empty;
        });
    });

    describe('utils.is()', function () {
        function expectTrue(data1, data2) {
            expect(utils.is(data1, data2)).to.be.true;
        }

        function expectFalse(data1, data2) {
            expect(utils.is(data1, data2)).to.be.false;
        }

        it('should be equal', function () {
            var arr = [];
            var obj = {};
            var date = new Date();
            var reg = /test/;

            expectTrue(null, null);
            expectTrue(undefined, undefined);
            expectTrue(true, true);
            expectTrue(false, false);
            expectTrue(NaN, NaN);
            expectTrue(1, 1);
            expectTrue(1.1, 1.1);
            expectTrue('1.1', '1.1');
            expectTrue('Test', 'Test');
            expectTrue(reg, reg);
            expectTrue(arr, arr);
            expectTrue(obj, obj);
            expectTrue(date, date);
        });

        it('should NOT be equal', function () {
            expectFalse('allo', 'Allo');
            expectFalse(1, '1');
            expectFalse(new Date(), new Date());
            expectFalse([], []);
            expectFalse({}, {});
            expectFalse(/test/, /test/);
        });
    });

    describe('utils.type()', function () {
        function check(data, type) {
            expect(utils.type(data)).to.equal(type);
        }

        it('should detect types accurately', function () {
            check(null, 'null');
            check(undefined, 'undefined');
            check(true, 'boolean');
            check(false, 'boolean');
            check(NaN, 'nan');
            check(1, 'number');
            check(1.1, 'number');
            check('1.1', 'string');
            check('Test', 'string');
            check(/test/, 'regexp');
            check(new Date(), 'date');
            check([], 'array');
            check({}, 'object');
            check(Array, 'function');
        });
    });

    beforeEach(function () {
    });

    afterEach(function () {
    });

    after(function () {
    });
});