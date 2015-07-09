/**
 * HashMap - hash utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 *
 * Hashing highly inspired by
 * - HashMap by Ariel Flesler https://github.com/flesler/hashmap
 */

'use strict';

// Module dependencies.

var defineProperty = require('./defineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isExtensible = require('./isExtensible');
var typeOf = require('./type');

// Module definition.

var hash = (function () {
    var identity = 0,
        identityProperty = '__hash_201506172259__',
        immutableTypeTest = {'undefined': 1, 'null': 1, 'boolean': 1, 'nan': 1, 'number': 1, 'regexp': 1};

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
            type = typeOf(target);

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
                hashes[i] = hash(target[i]);
            }
            return '♥' + hashes.join('⁞');
        default:
            if (!hasOwnProperty.call(target, identityProperty)) {
                if (isExtensible(target)) {
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
                } else {
                    throw new TypeError('Cannot use the given key, object is not extensible');
                }
            }

            return '♦' + target[identityProperty];
        }
    };
}());

// Module exports.

module.exports = hash;
