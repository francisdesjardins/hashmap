/**
 * HashMap - type utility
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies.

var toString = Object.prototype.toString;

// Module variables.

var typeRegEx = /\[object (\S*)\]/gi;

// Module definition.

/**
* @param {*} target
* @returns {!string}
*/
module.exports = function (target) {
    var type = toString.apply(target).replace(typeRegEx, '$1').toLowerCase();

    if (type === 'number' && isNaN(target)) {
        return 'nan';
    }

    if (type === 'object') {
        switch (target) {
        case null:
            return 'null';
        case undefined:
            return 'undefined';
        default:
            return type;
        }
    }

    return type;
};
