/**
 * HashMap - isNot utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies.

var is = require('./is');

// Module definition.

/**
 * @param {*} x
 * @param {*} y
 * @returns {!boolean}
 */
module.exports = function (x, y) {
    return !is(x, y);
};
