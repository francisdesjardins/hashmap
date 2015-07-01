'use strict';

var expect = require('chai').expect,
    HashMap = require('../lib/hashmap'),
    hashMap;

describe('HashMap', function () {
    beforeEach(function () {
        hashMap = new HashMap();
    });

    describe('HashMap.clone()', function () {
        function checkTrue(arr, arr2) {
            expect(arr).to.deep.equal(arr2);
        }

        it('should have same keys than its clone', function () {
            hashMap.put(1, 2);
            hashMap.put(3, 4);
            hashMap.put(5, 6);

            var clone = hashMap.clone(),
                originalIterator = hashMap.keys(),
                originalKeys = [],
                cloneIterator = clone.keys(),
                cloneKeys = [];

            while (originalIterator.hasNext()) {
                originalKeys.push(originalIterator.next());
            }

            while (cloneIterator.hasNext()) {
                cloneKeys.push(cloneIterator.next());
            }

            checkTrue(originalKeys, cloneKeys);
        });

        it('should have same values than its clone', function () {
            hashMap.put(1, 2);
            hashMap.put(3, 4);
            hashMap.put(5, 6);

            var clone = hashMap.clone(),
                originalIterator = hashMap.values(),
                originalValues = [],
                cloneIterator = clone.values(),
                cloneValues = [];

            while (originalIterator.hasNext()) {
                originalValues.push(originalIterator.next());
            }

            while (cloneIterator.hasNext()) {
                cloneValues.push(cloneIterator.next());
            }

            checkTrue(originalValues, cloneValues);
        });
    });

    describe('HashMap.compute()', function () {
        it('should compute a mapping for the specified key and its current mapped value', function () {
            var key = 1,
                value = 'Hello';

            hashMap.put(key, value);

            hashMap.compute(1, function (k, v) {
                expect(k).to.equal(key);
                expect(v).to.equal(value);

                return v + 'World';
            });

            expect(hashMap.get(key)).to.equal('HelloWorld');
        });
    });

    describe('HashMap.equals()', function () {
        function checkTrue(hashMap1, hashMap2) {
            expect(hashMap1.equals(hashMap2)).to.be.true;
        }

        function checkFalse(hashMap1, hashMap2) {
            expect(hashMap1.equals(hashMap2)).to.be.false;
        }

        it('should be equal against itself', function () {
            hashMap.put('key1', 'value1');

            checkTrue(hashMap, hashMap);
        });

        it('should be equal against its clone', function () {
            hashMap.put('key1', 'value1');

            checkTrue(hashMap, hashMap.clone());
        });

        it('should be equal to another instance with same key and value', function () {
            hashMap.put('key1', 'value1');

            var hashMap2 = new HashMap();
            hashMap2.put('key1', 'value1');

            checkTrue(hashMap, hashMap2);
        });

        it('should NOT be equal to another instance with different keys or values', function () {
            hashMap.put('key1', 'value1');

            checkFalse(hashMap, new HashMap());
        });

        it('should NOT be equal to anything else', function () {
            hashMap.put('key1', 'value1');

            checkFalse(hashMap, 1);
            checkFalse(hashMap, '');
            checkFalse(hashMap, {});
            checkFalse(hashMap, []);
            checkFalse(hashMap, /123/);
            checkFalse(hashMap, new Date());
            checkFalse(hashMap, null);
            checkFalse(hashMap, undefined);
            checkFalse(hashMap, HashMap);
        });
    });

    describe('HashMap.get()', function () {
        var id = 1;
        function val() { return 'value' + (id += 1); }

        it('should map the same key to the same hash', function () {
            function check(key) {
                var value = val();
                hashMap.put(key, value);
                expect(hashMap.get(key)).to.equal(value);
            }

            check(null);
            check(undefined);
            check(false);
            check(NaN);
            check(1);
            check('test');
            check(/test/);
            check(new Date());
            check([]);
            check({});
            check(HashMap);
            check(hashMap);
        });

        it('should map these pair of keys to the same hash', function () {
            var regex = /test/;
            var date = new Date();
            var arr = [];
            var arr1 = [1, 2, 'Q'];
            var arr2 = [null, /a/, NaN];
            var obj = {};

            function check(key, key2) {
                var value = val();
                hashMap.put(key, value);
                expect(hashMap.get(key2)).to.equal(value);
            }

            check(null, null);
            check(undefined, undefined);
            check(false, false);
            check(NaN, NaN);
            check(1, 1);
            check('Test', 'Test');
            check(regex, regex);
            check(date, date);
            check(arr, arr);
            check(arr1, arr1);
            check(arr2, arr2);
            check(obj, obj);
        });

        it('should NOT map these pair of keys to the same hash', function () {
            function check(key, key2) {
                var value = val();
                hashMap.put(key, value);
                expect(hashMap.get(key2)).not.to.equal(value);
            }

            check(null, undefined);
            check(null, false);
            check(false, 0);
            check(false, '');
            check(1, '1');
            check(/test/, /test2/);
            check(/test/, '/test/');
            check(new Date(123456789), new Date(987654321));
            check({}, {});
            check([1,2], [2,1]);
        });
    });

    describe('HashMap.getOrDefault()', function () {
        it('should retrieve the default value if key has no value', function () {
            function check(key, defaultValue) {
                expect(hashMap.getOrDefault(key, defaultValue)).to.equal(defaultValue);
            }

            check('key', 'value');
        });
    });

    describe('HashMap.putIfAbsent()', function () {
        it('should add the map only if the key is absent', function () {
            hashMap.putIfAbsent(1, 1);
            expect(hashMap.size()).to.equal(1);
            hashMap.putIfAbsent(1, 2);
            expect(hashMap.get(1)).not.to.equal(2);
        });
    });

    describe('HashMap.size()', function () {
        it('should be 0 on empty HashMap', function () {
            expect(hashMap.size()).to.equal(0);
        });

        it('should grow each time a key is added', function () {
            var to = 10;

            for (var i = 0; i < to; i++) {
                hashMap.put(i, i);

                expect(hashMap.size()).to.equal(i+1);
            }

            expect(hashMap.size()).to.equal(to);
        });

        it('should reduce each time a key is removed', function () {
            hashMap.put(1, 1);
            hashMap.put(2, 2);
            hashMap.put(3, 3);

            var lastSize = hashMap.size();

            hashMap.forEach(function(k) {
                this.remove(k);

                expect(hashMap.size()).to.equal(lastSize-1);

                lastSize -= 1;
            }, hashMap);

            expect(hashMap.size()).to.equal(0);
        });
    });

    afterEach(function () {
    });

    after(function () {
    });
});
