/**
 * HashMap - requireDefined utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module definition.

/**
 * @param {*} o
 * @param {string} m
 * @throws ReferenceError
 */
module.exports = function (o, m) {
    if (o === undefined) {
        throw new ReferenceError(m);
    }
};

