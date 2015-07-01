/**
 * HashMap - requireInstanceOf utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module definition.

/**
 * @param {*} o
 * @param {*} c
 * @param {string} m
 * @throws TypeError
 */
module.exports = function (o, c, m) {
    if (!(o instanceof c)) {
        throw new TypeError(m);
    }
};
