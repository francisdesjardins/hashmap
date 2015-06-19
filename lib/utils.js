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

var defineProperty = Object.defineProperty;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

// Module variables.

var typeOfRegEx = /\[object ([a-z]*)\]/gi;

// Module definition.

exports.hash = (function () {
    var identity = 0,
        identityProperty = '__HashMap_201506172259__',
        immutableTypeTest = {'undefined': 1, 'null': 1, 'boolean': 1, 'nan': 1, 'number': 1, 'regexp': 1};

    if (!defineProperty) {
        defineProperty = function (obj, prop, descriptor) {
            obj[prop] = descriptor.value;
        };
    }

    /**
     * @returns {!number}
     */
    function nextIdentity() {
        identity += 1;

        return identity;
    }

    return function (target) {
        var hashes,
            i,
            length,
            type = exports.typeOf(target);

        if (hasOwnProperty.call(immutableTypeTest, type)) {
            return String(target);
        }

        switch (type) {
        case 'date':
            return '♣' + target.getTime();
        case 'string':
            return '♠' + target;
        case 'array':
            hashes = [];
            for (i = 0, length = target.length; i < length; i += 1) {
                hashes[i] = exports.hash(target[i]);
            }
            return '♥' + hashes.join('⁞');
        default:
            if (!hasOwnProperty.call(target, identityProperty)) {
                try {
                    defineProperty(target, identityProperty, {
                        value: nextIdentity(),
                        writable: false,
                        configurable: false,
                        enumerable: false
                    });
                } catch (e) { // Thanks IE8; feel my wrath!
                    target[identityProperty] = nextIdentity();
                }
            }

            return '♦' + target[identityProperty];
        }
    };
}());

exports.identify = (function () {
    var identity = 0;

    /**
     * @returns {!number}
     */
    function nextIdentity() {
        identity += 1;

        return identity;
    }

    /**
     * @returns {!number}
     */
    return function () {
        return nextIdentity();
    };
}());

/**
 * @param {*} x
 * @param {*} y
 * @returns {!boolean}
 */
exports.is = function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }

    return x !== x;
};

/**
 * @param {*} x
 * @param {*} y
 * @returns {!boolean}
 */
exports.isNot = function (x, y) {
    return !exports.is(x, y);
};

/**
 * @type {Function}
 */
exports.now =
    Date.now ||
    function () {
        return new Date().getTime();
    };

/**
 * @param {*} o
 * @param {string} m
 * @throws ReferenceError
 */
exports.requireDefined = function (o, m) {
    if (o === undefined) {
        throw new ReferenceError(m);
    }
};

/**
 * @param {*} o
 * @param {string} m
 * @throws TypeError
 */
exports.requireFunction = function (o, m) {
    if (typeof o !== 'function') {
        throw new TypeError(m);
    }
};

/**
 * @param {*} o
 * @param {*} c
 * @param {string} m
 * @throws TypeError
 */
exports.requireInstanceOf = function (o, c, m) {
    if (!(o instanceof c)) {
        throw new TypeError(m);
    }
};

/**
 * @param {*} o
 * @param {string} m
 * @throws ReferenceError
 */
exports.requireNonNull = function (o, m) {
    if (o === null) {
        throw new ReferenceError(m);
    }
};

/**
 * @param {*} target
 * @returns {!string}
 */
exports.typeOf = function (target) {
    var type = toString.apply(target).replace(typeOfRegEx, '$1').toLowerCase();

    if (type === 'number' && isNaN(target)) {
        return 'nan';
    }

    return type;
};
