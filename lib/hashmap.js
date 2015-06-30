/**
 * HashMap - HashMap JavaScript class inspired by JDK 8 HashMap class
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * @version 0.0.1
 * Homepage: https://github.com/francisdesjardins/hashmap
 *
 * Key hashing, tests and 'did not knew that' highly inspired by
 * - HashMap by Ariel Flesler https://github.com/flesler/hashmap
 */

'use strict';

// Module dependencies.

var Iterator = require('./iterator');

var createKey = require('private-parts').createKey;
var extend = require('xtend');
var is = require('./utils').is;
var isNot = require('./utils').isNot;
var requireDefined = require('./utils').requireDefined;
var requireFunction = require('./utils').requireFunction;
var requireInstanceOf = require('./utils').requireInstanceOf;
var hash = require('./utils').hash;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Module variables.

var defaults = {cacheKeys: true};
var previousHashMap = global.HashMap;
var privates = createKey();

// Module definition.

/**
 * Represents a HashMap.
 * @param {HashMap} [map]
 * @param {Object} [options]
 * @constructor
 */
function HashMap(map, options) {
    privates(this).map = {};
    privates(this).settings = extend({}, defaults, options);

    switch (arguments.length) {
    case 0:
        break;
    case 1:
        this.putAll(map);
        break;
    default:
        throw new Error();
    }
}

/**
 * Hand over the control of the global variable "HashMap" to another library
 * @returns {HashMap}
 */
HashMap.noConflict = function () {
    global.HashMap = previousHashMap;

    return HashMap;
};

/**
 * Removes all of the mappings from this map.
 */
HashMap.prototype.clear = function () {
    privates(this).map = {};
};

/**
 * Returns a shallow copy of this HashMap instance: the keys and values
 * themselves are not cloned.
 * @returns {HashMap}
 */
HashMap.prototype.clone = function () {
    return new HashMap(this);
};

/**
 * Attempts to compute a mapping for the specified key and its current
 * mapped value (or null if there is no current mapping).
 * @param {*} key
 * @param {remappingFunction_Key_OldValue} remappingFunction
 * @param {Object} [context=this]
 * @returns {*}
 * @throws ReferenceError, TypeError
 */
HashMap.prototype.compute = function (key, remappingFunction, context) {
    requireFunction(remappingFunction, '"remappingFunction" is not a function');

    context = context || this;

    var oldValue = this.get(key),
        newValue = remappingFunction.apply(context, [key, oldValue]);

    requireDefined(newValue, '"newValue" is undefined');

    if (newValue === null) {
        if (oldValue !== null || this.containsKey(key)) {
            this.remove(key);
        }

        return null;
    }

    this.put(key, newValue);

    return newValue;
};

/**
 * If the specified key is not already associated with a value (or is
 * mapped to null), attempts to compute its value using the given mapping
 * function and enters it into this map unless null.
 * @param {*} k
 * @param {mappingFunction_Key} mappingFunction
 * @param {Object} [context=this]
 * @returns {*}
 */
HashMap.prototype.computeIfAbsent = function (k, mappingFunction, context) {
    requireFunction(mappingFunction, '"mappingFunction" is not a function');

    context = context || this;

    var newValue,
        oldValue = this.get(k);

    if (oldValue === null) {
        newValue = mappingFunction.apply(context, [k]);

        requireDefined(newValue, '"newValue" is undefined');

        if (newValue !== null) {
            this.put(k, newValue);

            return newValue;
        }
    }

    return oldValue;
};

/**
 * If the value for the specified key is present and non-null, attempts to
 * compute a new mapping given the key and its current mapped value.
 * @param {*} key
 * @param {remappingFunction_Key_OldValue} remappingFunction
 * @param {Object} [context=this]
 * @returns {*}
 * @throws ReferenceError, TypeError
 */
HashMap.prototype.computeIfPresent = function (key, remappingFunction, context) {
    requireFunction(remappingFunction, '"remappingFunction" is not a function');

    context = context || this;

    var oldValue = this.get(key),
        newValue;

    if (oldValue !== null) {
        newValue = remappingFunction.apply(context, [key, oldValue]);

        requireDefined(newValue, '"newValue" is undefined');

        if (newValue !== null) {
            this.put(key, newValue);

            return newValue;
        }

        this.remove(key);
    }

    return null;
};

/**
 * Returns true if the map contains 'key' as a key. Otherwise, returns false.
 * @param {*} key
 * @returns {!boolean}
 */
HashMap.prototype.containsKey = function (key) {
    var hashCode = hash(key),
        map = privates(this).map;

    return hasOwnProperty.call(map, hashCode);
};

/**
 * Returns true if the map contains 'value' as a value. Otherwise, returns false.
 * @param {*} value
 * @returns {!boolean}
 */
HashMap.prototype.containsValue = function (value) {
    var found = false;

    /*jshint unused: true, node: true */
    /*jslint unparam: true, node: true */
    this.forEach(function (k, v) {
        if (is(value, v)) {
            found = true;

            return !found;
        }
    });

    return found;
};

/**
 * @returns {Iterator<{key: *, value: *}>}
 */
HashMap.prototype.entries = function () {
    var entries = [],
        self = this;

    this.forEach(function (k, v) {
        entries.push({key: k, value: v});
    });

    return new Iterator(
        entries,
        function (currentIndex, current) {
            self.remove(current.key);
        }
    );
};

/**
 * Compares the specified object with this map for equality.
 * @param {HashMap} o
 * @returns {!boolean}
 */
HashMap.prototype.equals = function (o) {
    if (o === this) {
        return true;
    }

    if (!(o instanceof HashMap)) {
        return false;
    }

    if (this.size() !== o.size()) {
        return false;
    }

    var entries = this.entries(),
        entry;

    while (entries.hasNext()) {
        entry = entries.next();

        if (entry.value === null) {
            if (!(entry.key === null && o.containsKey(entry.key))) {
                return false;
            }
        } else if (isNot(entry.value, o.get(entry.key))) {
            return false;
        }
    }

    return true;
};

/**
 * Performs the given action for each entry in this map until all entries
 * have been processed or the given action returns false.
 * @param {action_Key_Value} action The action to be performed for each entry.
 * @param {Object} [context=this]
 * @throws TypeError
 */
HashMap.prototype.forEach = function (action, context) {
    requireFunction(action, '"action" is not a function');

    context = context || this;

    var key,
        map = privates(this).map;

    for (key in map) {
        if (hasOwnProperty.call(map, key)) {
            if (action.apply(context, map[key]) === false) {
                break;
            }
        }
    }
};

/**
 * Returns the value to which the specified key is mapped, or null if this
 * map contains no mapping for the key.
 * @param {*} key
 * @returns {*}
 */
HashMap.prototype.get = function (key) {
    var hashCode = hash(key),
        map = privates(this).map;

    if (hasOwnProperty.call(map, hashCode)) {
        return map[hashCode][1];
    }

    return null;
};

/**
 * Returns the value to which the specified key is mapped, or value if this
 * map contains no mapping for the key.
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
HashMap.prototype.getOrDefault = function (key, value) {
    return this.containsKey(key) ? this.get(key) : value;
};

/**
 * Returns true if this map contains no key-value mappings.
 * @returns {!boolean}
 */
HashMap.prototype.isEmpty = function () {
    return !this.size();
};

/**
 * Returns an array of the keys contained in this map.
 * @returns {!Array}
 */
HashMap.prototype.keys = function () {
    var keys = [];

    this.forEach(function (k) {
        keys.push(k);
    });

    return keys;
};

/**
 * If the specified key is not already associated with a value or is
 * associated with null, associates it with the given non-null value.
 * @param {*} key
 * @param {*} value
 * @param {remappingFunction_OldValue_Value} remappingFunction
 * @param {Object} [context=this]
 * @throws ReferenceError|TypeError
 */
HashMap.prototype.merge = function (key, value, remappingFunction, context) {
    requireFunction(remappingFunction, '"remappingFunction" is not a function');

    context = context || this;

    var newValue, oldValue;

    oldValue = this.get(key);
    newValue = oldValue === null ? value : remappingFunction.apply(context, [oldValue, value]);

    requireDefined(newValue, '"newValue" is undefined');

    if (newValue === null) {
        this.remove(key);
    } else {
        return this.put(key, newValue);
    }

    return newValue;
};

/**
 * Associates the specified value with the specified key in this map.
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
HashMap.prototype.put = function (key, value) {
    requireDefined(value, '"value" is undefined');

    var hashCode = hash(key),
        map = privates(this).map;

    map[hashCode] = [key, value];

    return value;
};

/**
 * Copies all of the mappings from the specified map to this map
 * These mappings will replace any mappings that this map had for any of
 * the keys currently in the specified map.
 * @param {HashMap} map
 * @throws TypeError
 */
HashMap.prototype.putAll = function (map) {
    requireInstanceOf(map, HashMap, '"map" is not an instance of HashMap');

    var entries = map.entries(),
        entry;

    while (entries.hasNext()) {
        entry = entries.next();

        this.put(entry.key, entry.value);
    }
};

/**
 * If the specified key is not already associated with a value (or is
 * mapped to null) associates it with the given value and returns null,
 * else returns the current value.
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
HashMap.prototype.putIfAbsent = function (key, value) {
    var currentValue = this.get(key);

    if (currentValue === null) {
        currentValue = this.put(key, value);
    }

    return currentValue;
};

/**
 * Removes the mapping for this key.
 * @param {*} key
 * @returns {*}
 */
HashMap.prototype.remove = function (key) {
    var currentValue,
        hashCode = hash(key),
        map = privates(this).map;

    if (hasOwnProperty.call(map, hashCode)) {
        currentValue = map[hashCode][1];

        delete map[hashCode];

        return currentValue;
    }

    return null;
};

/**
 * Removes the mapping for this key from this map if present.
 * @param {*} key
 * @param {*} value
 * @returns {!boolean}
 */
HashMap.prototype.removeIfPresent = function (key, value) {
    var currentValue = this.get(key);

    if (isNot(currentValue, value) || (currentValue === null && !this.containsKey(key))) {
        return false;
    }

    this.remove(key);

    return true;
};

/**
 * Replaces the entry for the specified key only if it is currently mapped
 * to some value
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
HashMap.prototype.replace = function (key, value) {
    var currentValue = this.get(key);

    if (currentValue !== null) {
        return this.put(key, value);
    }

    return currentValue;
};

/**
 * Replaces the entry for the specified key only if currently mapped to the
 * specified value
 * @param {*} key
 * @param {*} value
 * @param {*} newValue
 * @returns {!boolean}
 */
HashMap.prototype.replaceIfPresent = function (key, value, newValue) {
    var currentValue = this.get(key);

    if (isNot(currentValue, value) || (currentValue === null && !this.containsKey(key))) {
        return false;
    }

    this.put(key, newValue);

    return true;
};

/**
 * Replaces each entry's value with the result of invoking the given
 * function on that entry until all entries have been processed or the
 * function returns false
 * @param {replacingFunction_Key_Value} replacingFunction
 * @param {Object} [context=this]
 */
HashMap.prototype.replaceAll = function (replacingFunction, context) {
    requireFunction(replacingFunction, '"replacingFunction" is not a function');

    context = context || this;

    var entries = this.entries(),
        entry,
        newValue;

    while (entries.hasNext()) {
        entry = entries.next();

        newValue = replacingFunction.apply(context, [entry.key, entry.value]);

        if (newValue !== undefined) {
            if (newValue === null) {
                this.remove(entry.key);
            } else {
                this.put(entry.key, newValue);
            }
        }
    }
};

/**
 * Returns the number of key-value mappings in this map.
 * @returns {!number}
 */
HashMap.prototype.size = function () {
    return this.keys().length;
};

/**
 * Returns an Array of the values contained in this map.
 * @returns {!Array}
 */
HashMap.prototype.values = function () {
    var values = [];

    /*jshint unused: true, node: true */
    /*jslint unparam: true, node: true */
    this.forEach(function (k, v) {
        values.push(v);
    });

    return values;
};

/**
 * @callback action_Key_Value
 * @param {*} key
 * @param {*} value
 */

/**
 * @callback mappingFunction_Key
 * @param {*} key
 */

/**
 * @callback remappingFunction_Key_OldValue
 * @param {*} key
 * @param {*} oldValue
 */

/**
 * @callback remappingFunction_OldValue_Value
 * @param {*} oldValue
 * @param {*} value
 */

/**
 * @callback replacingFunction_Key_Value
 * @param {*} key
 * @param {*} value
 */

// Module exports.

module.exports = HashMap;
