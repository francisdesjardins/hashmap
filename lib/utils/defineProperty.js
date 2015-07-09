/**
 * HashMap - defineProperty utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies;

var defineProperty = Object.defineProperty;

// Module definition.

if (typeof defineProperty !== 'function') {
    defineProperty = function (obj, prop, descriptor) {
        obj[prop] = descriptor.value;
    };
}

// Module exports.

module.exports = defineProperty;
