/**
 * HashMap - isExtensible utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies;

var isExtensible = Object.isExtensible;

// Module definition.

if (typeof isExtensible !== 'function') {
    isExtensible = function () {
        return true;
    };
}

// Module exports.

module.exports = isExtensible;
