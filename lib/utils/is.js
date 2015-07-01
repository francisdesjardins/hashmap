/**
 * HashMap - is utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module definition.

/**
 * @param {*} x
 * @param {*} y
 * @returns {!boolean}
 */
module.exports = function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }

    return x !== x;
};
