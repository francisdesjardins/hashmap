/**
 * HashMap - hashmap unit test
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

var test = require('tape');
var HashMap = require('../lib/hashmap');
var hashMap;

function before() {
    hashMap = new HashMap();
}

test('HashMap.clear()', function (t) {
    before();

    hashMap.put(1, 2);
    hashMap.put('1', 2);

    hashMap.clear();

    t.equal(hashMap.size(), 0, 'size is 0');
    t.equal(hashMap.keys().length, 0, 'keys length is 0');
    t.equal(hashMap.values().length, 0, 'values length is 0');
    t.equal(hashMap.entries().length, 0, 'entries length is 0');

    t.end();
});

test('HashMap.clone()', function (t) {
    before();

    hashMap.put(1, 2);
    hashMap.put(3, 4);
    hashMap.put(5, 6);

    var clone = hashMap.clone(),
        cloneIterator = clone.entries(),
        cloneEntries = [];

    while (cloneIterator.hasNext()) {
        cloneEntries.push(cloneIterator.next());
    }

    t.deepEqual(cloneEntries, [{key: 1, value: 2}, {key: 3, value: 4}, {key: 5, value: 6}], 'should have same keys and values than its clone');

    t.end();
});

test('HashMap.compute()', function (t) {
    before();

    hashMap.put(1, 'Hello');
    hashMap.put(3, 'Bye');

    /*jshint unused: true, node: true */
    /*jslint unparam: true, node: true */
    t.equal(hashMap.compute(1, function (k, v) {
        return v + 'World';
    }), 'HelloWorld', 'returns "HelloWorld"');

    t.equal(hashMap.get(1), 'HelloWorld', 'key should map to "HelloWorld"');
    t.equal(hashMap.get(3), 'Bye', 'key should NOT map to value + "World"');

    /*jshint unused: true, node: true */
    /*jslint unparam: true, node: true */
    hashMap.compute(1, function (k, v) {
        t.deepEqual(hashMap, this, 'default context is respected');

        return v;
    });

    /*jshint unused: true, node: true */
    /*jslint unparam: true, node: true */
    var context = {};
    hashMap.compute(1, function (k, v) {
        t.deepEqual(context, this, 'context is respected');

        return v;
    }, context);

    hashMap.compute(1, function () {
        return null;
    });

    t.notOk(hashMap.containsKey(1), 'should remove key if null is returned');
    t.ok(hashMap.containsKey(3), 'other key should still exist');

    t.end();
});

test('HashMap.computeIfAbsent', function (t) {
    before();

    var key = 1,
        computedValue = 'HelloWorld',
        context = {};

    t.deepEqual(hashMap.computeIfAbsent(key, function (k) {
        t.deepEqual(k, key, 'search and "not" found key matches');

        return computedValue;
    }), computedValue, 'computed value is returned');

    t.ok(hashMap.containsKey(key), 'key has been added');
    t.deepEqual(hashMap.get(key), computedValue, 'computed value has been set');

    t.deepEqual(hashMap.computeIfAbsent(key, function () {
        t.fail('should NOT compute if key exists');
    }), computedValue, 'should return current value if key exists');

    hashMap.computeIfAbsent(2, function () {
        t.deepEqual(hashMap, this, 'default context is respected');

        return null;
    });

    hashMap.computeIfAbsent(2, function () {
        t.deepEqual(context, this, 'context is respected');

        return null;
    }, context);

    t.notOk(hashMap.containsKey(2), 'key does NOT exist when computed value is null');

    t.end();
});

test('HashMap.computeIfPresent', function (t) {
    before();

    var key1 = 1,
        key2 = 3,
        computedValue = 'HelloWorld',
        value = 'Hello',
        context = {};

    hashMap.put(key1, value);
    hashMap.put(key2, value);

    t.equal(hashMap.computeIfPresent(key1, function (k, oldV) {
        t.equal(key1, k, 'searched and found key matches');
        t.equal(value, oldV, 'searched and found value matches');
        t.deepEqual(hashMap, this, 'default context is respected');

        return oldV + 'World';
    }), computedValue, 'computed value is returned');

    t.equal(hashMap.get(key1), computedValue, 'computed key should map to "' + computedValue + '"');
    t.equal(hashMap.get(key2), value, 'NOT computed key should NOT map to "' + computedValue + '"');

    t.deepEqual(hashMap.computeIfAbsent(key2, function () {
        t.fail('should NOT compute if key exists');
    }), value, 'should return current value if key exists');

    hashMap.computeIfPresent(key1, function () {
        t.deepEqual(context, this, 'context is respected');

        return null;
    }, context);

    t.notOk(hashMap.containsKey(key1), 'key does NOT exist when computed value is null');

    t.end();
});

test('HashMap.containsKey()', function (t) {
    before();

    var key1 = 1,
        key2 = 2,
        value = 'test';

    hashMap.put(key1, value);

    t.ok(hashMap.containsKey(key1), 'key exists');
    t.notOk(hashMap.containsKey(key2), 'key does NOT exist');

    t.end();
});

test('HashMap.containsValue()', function (t) {
    before();

    var key1 = 1,
        value1 = 'test1',
        value2 = 'test2';

    hashMap.put(key1, value1);

    t.ok(hashMap.containsValue(value1), 'value exists');
    t.notOk(hashMap.containsValue(value2), 'value does NOT exist');

    t.end();
});

test('HashMap.entries()', function (t) {
    before();

    var entries = hashMap.entries(),
        entry;

    t.notOk(entries.hasNext(), 'empty hashmap has no entries');

    hashMap.put(1, 'test');

    entries = hashMap.entries();

    t.equal(entries.length, hashMap.size(), 'same size has the hashmap');
    t.ok(entries.hasNext(), 'there is a next entry');

    while (entries.hasNext()) {
        entry = entries.next();

        t.equal(entry.key, 1, 'entry key is the hashmap key');
        t.equal(entry.value, 'test', 'entry value is the hashmap value');
    }

    t.throws(function () {
        entries.next();
    }, /the iteration has no more elements/, 'throws exception when next() fails');

    t.end();
});

test('HashMap.equals()', function (t) {
    before();

    hashMap.put('key1', 'value1');

    var hashMap2 = new HashMap();
    hashMap2.put('key1', 'value1');

    t.ok(hashMap.equals(hashMap), 'should equal itself');
    t.ok(hashMap.equals(hashMap.clone()), 'should equal its clone');
    t.ok(hashMap.equals(hashMap2), 'should equal another instance with same key and value');
    t.notOk(hashMap.equals(new HashMap()), 'should NOT equal another instance with different keys or values');
    t.notOk(hashMap.equals(1), 'should NOT equal 1');
    t.notOk(hashMap.equals(''), 'should NOT equal ""');
    t.notOk(hashMap.equals({}), 'should NOT equal {}');
    t.notOk(hashMap.equals([]), 'should NOT be equal to []');
    t.notOk(hashMap.equals(/123/), 'should NOT be equal to /123/');
    t.notOk(hashMap.equals(new Date()), 'should NOT be equal to new Date()');
    t.notOk(hashMap.equals(null), 'should NOT be equal to null');
    t.notOk(hashMap.equals(undefined), 'should NOT be equal to undefined');
    t.notOk(hashMap.equals(HashMap), 'should NOT be equal to HashMap');

    t.end();
});

test('HashMap.forEach()', function (t) {
    before();

    var context = {},
        keys = [],
        values = [],
        size = 0;

    hashMap.put(1, 'a');
    hashMap.put(2, 'b');
    hashMap.put(3, 'c');

    hashMap.forEach(function (k, v) {
        size += 1;

        keys.push(k);
        values.push(v);
    });

    t.equal(size, 3);
    t.deepEquals(keys, [1, 2, 3]);
    t.deepEquals(values, ['a', 'b', 'c']);

    size = 0;
    hashMap.forEach(function () {
        size += 1;

        t.deepEqual(hashMap, this, 'default context is respected');

        return false;
    });

    t.equal(size, 1, 'returning false stops the iteration');

    hashMap.forEach(function () {
        t.deepEqual(context, this, 'context is respected');

        return false;
    }, context);

    t.end();
});

test('HashMap.get()', function (t) {
    var id = 0,
        obj = {};

    function val() {
        id += 1;

        return 'value' + id;
    }

    function isEqual(key, value, message) {
        hashMap.put(key, value);
        t.equal(hashMap.get(key), value, message);
    }

    function isEqualToSame(key1, key2, value, message) {
        hashMap.put(key1, value);
        t.equal(hashMap.get(key2), value, message);
    }

    function isNotEqual(key, key2, value, message) {
        hashMap.put(key, value);
        t.notEqual(hashMap.get(key2), value, message);
    }

    // should map the same key to the same hash
    before();

    isEqual(null, val(), 'null should map to ' + id);
    isEqual(undefined, val(), 'undefined should map to ' + id);
    isEqual(false, val(), 'false should map to ' + id);
    isEqual(NaN, val(), 'NaN should map to ' + id);
    isEqual(1, val(), '1 should map to ' + id);
    isEqual('test', val(), '"test" should map to ' + id);
    isEqual(/test/, val(), '/test/ should map to ' + id);
    isEqual(new Date(), val(), 'new Date() should map to ' + id);
    isEqual([], val(), '[] should map to ' + id);
    isEqual({}, val(), '{} should map to ' + id);
    isEqual(HashMap, val(), 'HashMap should map to ' + id);
    isEqual(hashMap, val(), 'hashMap should map to ' + id);

    // should map these pair of keys to the same hash
    before();

    isEqualToSame(null, null, val(), 'null should map to ' + id);
    isEqualToSame(undefined, undefined, val(), 'undefined should map to ' + id);
    isEqualToSame(false, false, val(), 'false should map to ' + id);
    isEqualToSame(NaN, NaN, val(), 'NaN should map to ' + id);
    isEqualToSame(1, 1, val(), '1 should map to ' + id);
    isEqualToSame('Test', 'Test', val(), '"Test" should map to ' + id);
    isEqualToSame(/test/, /test/, val(), '/test/ should map to ' + id);
    isEqualToSame(new Date(524502300000), new Date(524502300000), val(), 'new Date(524502300000) should map to ' + id);
    isEqualToSame([], [], val(), '[] should map to ' + id);
    isEqualToSame([1, 2, 'Q'], [1, 2, 'Q'], val(), '[1, 2, "Q"] should map to ' + id);
    isEqualToSame([null, /a/, NaN], [null, /a/, NaN], val(), '[null, /a/, NaN] should map to ' + id);
    isEqualToSame(obj, obj, val(), '{} should map to ' + id);

    // should NOT map these pair of keys to the same hash
    before();

    isNotEqual(null, undefined, val(), 'undefined should NOT map to ' + id);
    isNotEqual(null, false, val(), 'false should NOT map to ' + id);
    isNotEqual(false, 0, val(), '0 should NOT map to ' + id);
    isNotEqual(false, '', val(), '"" should NOT map to ' + id);
    isNotEqual(1, '1', val(), '"1" should NOT map to ' + id);
    isNotEqual(/test/, /test2/, val(), '/test2/ should NOT map to ' + id);
    isNotEqual(/test/, '/test/', val(), '"/test/" should NOT map to ' + id);
    isNotEqual(new Date(123456789), new Date(987654321), val(), 'new Date(987654321) should NOT map to ' + id);
    isNotEqual({}, {}, val(), '{} should NOT map to ' + id);
    isNotEqual([1, 2], [2, 1], val(), '[2,1] should NOT map to ' + id);

    t.end();
});

test('HashMap.getOrDefault()', function (t) {
    before();

    function isEqual(key, defaultValue, message) {
        t.equal(hashMap.getOrDefault(key, defaultValue), defaultValue, message);
    }

    function isNotEqual(key, defaultValue, message) {
        t.notEqual(hashMap.getOrDefault(key, defaultValue), defaultValue, message);
    }

    hashMap.put('test', 'value');

    isEqual('key', 'defaultValue', 'should return the default value');
    isNotEqual('test', 'defaultValue', 'should NOT return the default value');

    t.end();
});

test('HashMap.isEmpty', function (t) {
    before();

    t.ok(hashMap.isEmpty(), 'hashmap is empty');

    hashMap.put(1, 'a');

    t.notOk(hashMap.isEmpty(), 'hashmap is NOT empty');

    hashMap.clear();

    t.ok(hashMap.isEmpty(), 'hashmap is empty after clear()');

    t.end();
});

test('HashMap.keys()', function (t) {
    before();

    var keys = hashMap.keys(),
        key;

    t.notOk(keys.hasNext(), 'empty hashmap has no keys');

    hashMap.put(1, 'test');

    keys = hashMap.keys();

    t.equal(keys.length, hashMap.size(), 'same size has the hashmap');
    t.ok(keys.hasNext(), 'there is a next key');

    while (keys.hasNext()) {
        key = keys.next();

        t.equal(key, 1, 'key is the hashmap key');
    }

    t.throws(function () {
        keys.next();
    }, /the iteration has no more elements/, 'throws exception when next() fails');

    t.end();
});

test('HashMap.merge()', function (t) {
    before();

    var context = {};

    hashMap.put(1, 'a');
    hashMap.put(2, 'b');
    hashMap.put(3, 'c');

    t.equal(hashMap.merge(1, 'z', function (oldValue, newValue) {
        t.equal(oldValue, 'a', '"oldValue" parameter is the original value');
        t.equal(newValue, 'z', '"newValue" parameter is the new value');

        return newValue + oldValue;
    }), 'za', 'merged value is returned');

    t.equal(hashMap.get(1), 'za', 'get() returns the merged value');

    t.throws(function () {
        hashMap.merge(2, 'b');
    }, /"remappingFunction" is not a function/, 'throws exception when "remappingFunction" is NOT a function');

    t.throws(function () {
        hashMap.merge(2, 'b', function () {
            return undefined;
        });
    }, /"newValue" is undefined/, 'throws exception when remapping function returns undefined');

    hashMap.merge(2, 'b', function () {
        return null;
    });

    t.notOk(hashMap.containsKey(2), 'removes mapping when remapping function returns null');

    hashMap.merge(3, 'c', function (oldValue) {
        t.deepEqual(hashMap, this, 'default context is respected');

        return oldValue;
    });

    hashMap.merge(3, 'c', function (oldValue) {
        t.deepEqual(context, this, 'context is respected');

        return oldValue;
    }, context);

    hashMap.merge(4, 'd', function () {
        t.fail('should NOT merge if key does NOT exist');
    });

    t.end();
});

test('HashMap.put()', function (t) {
    before();

    t.end();
});

test('HashMap.putAll()', function (t) {
    before();

    t.end();
});

test('HashMap.putIfAbsent()', function (t) {
    before();

    hashMap.putIfAbsent(1, 1);
    hashMap.putIfAbsent(1, 2);

    t.equal(hashMap.size(), 1, 'size should be 1');
    t.equal(hashMap.get(1), 1, 'value should be 1');
    t.notEqual(hashMap.get(1), 2, 'value should NOT be 2');

    t.end();
});

test('HashMap.remove', function (t) {
    before();

    hashMap.put(1, 'a');

    t.equal(hashMap.remove(2), null, 'returns null if key does NOT exist');
    t.equal(hashMap.remove(1), 'a', 'returns value if key exists');
    t.notOk(hashMap.containsKey(1), 'mapping has been removed');

    t.end();
});

test('HashMap.removeIfPresent', function (t) {
    before();

    hashMap.put(1, 'a');

    t.notOk(hashMap.removeIfPresent(2, 'b'), 'returns false when key and value are NOT matching');
    t.notOk(hashMap.removeIfPresent(2, 'a'), 'returns false when key is NOT matching');
    t.notOk(hashMap.removeIfPresent(1, 'b'), 'returns false when value is NOT matching');
    t.ok(hashMap.removeIfPresent(1, 'a'), 'returns true when key and value are matching');
    t.notOk(hashMap.containsKey(1), 'mapping has been removed');

    t.end();
});

test('HashMap.replace', function (t) {
    before();

    hashMap.put(1, 'aa');

    t.equal(hashMap.replace(2, 'aa'), null, 'returns null when value is NOT replaced');
    t.equal(hashMap.replace(1, 'aa'), 'aa', 'return new value when value is replaced');
    t.equal(hashMap.size(), 1, 'size should not change when replaced');

    t.end();
});

test('HashMap.replaceIfPresent', function (t) {
    before();

    hashMap.put(1, 'a');

    t.notOk(hashMap.replaceIfPresent(2, 'a', 'aa'), 'returns false when value is NOT replaced');
    t.ok(hashMap.replaceIfPresent(1, 'a', 'aa'), 'returns true when value is replaced');
    t.equal(hashMap.get(1), 'aa', 'returned value is the replaced value');

    t.end();
});

test('HashMap.replaceAll', function (t) {
    before();

    var context = {},
        entries,
        entry,
        size,
        values = [];

    hashMap.put(1, 'a');
    hashMap.put(2, 'b');
    hashMap.put(3, 'c');

    size = 0;
    hashMap.replaceAll(function (k, v) {
        size += 1;

        return v + v;
    });

    t.equal(size, 3, 'iterates over every entries');

    entries = hashMap.entries();
    while (entries.hasNext()) {
        entry = entries.next();

        values.push(entry.value);
    }
    t.deepEqual(values, ['aa', 'bb', 'cc'], 'values were replaced');

    hashMap.remove(3);
    hashMap.remove(2);

    hashMap.replaceAll(function () {
        t.deepEqual(hashMap, this, 'default context is respected');
    });

    hashMap.replaceAll(function () {
        t.deepEqual(context, this, 'context is respected');
    }, context);

    size = hashMap.size();
    hashMap.replaceAll(function () {
        size -= 1;
        return null;
    });

    t.equal(size, 0, 'returning null removes the mapping');

    t.end();
});

test('HashMap.size()', function (t) {
    before();

    var to = 10,
        i;

    t.equal(hashMap.size(), 0, 'should be 0 on empty HashMap');

    for (i = 0; i < to; i += 1) {
        hashMap.put(i, i);
    }

    t.equal(hashMap.size(), to, 'should be ' + to);

    hashMap.forEach(function (k) {
        this.remove(k);
    }, hashMap);

    t.equal(hashMap.size(), 0, 'should be 0 when every key are removed');

    t.end();
});

test('HashMap.values()', function (t) {
    before();

    var values = hashMap.values(),
        value;

    t.notOk(values.hasNext(), 'empty hashmap has no values');

    hashMap.put(1, 'test');

    values = hashMap.values();

    t.equal(values.length, hashMap.size(), 'same size has the hashmap');
    t.ok(values.hasNext(), 'there is a next value');

    while (values.hasNext()) {
        value = values.next();

        t.equal(value, 'test', 'value is the hashmap value');
    }

    t.throws(function () {
        values.next();
    }, /the iteration has no more elements/, 'throws exception when next() fails');

    t.end();
});
