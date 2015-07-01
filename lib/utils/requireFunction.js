/**
 * HashMap - requireFunction utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module definition.

/**
 * @param {*} o
 * @param {string} m
 * @throws TypeError
 */
module.exports = function (o, m) {
    if (typeof o !== 'function') {
        throw new TypeError(m);
    }
};

