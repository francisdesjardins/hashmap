/**
 * HashMap - Iterator interface
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies.

var requireFunction = require('../../utils/requireFunction');

// Module definition.

/**
 * Interface for classes that represents an iterator
 * @interface
 */
var Iterator = {
    /**
     * Execute the given action on each remaining entries
     * @param action
     * @param {Object} [context=this]
     */
    forEachRemaining: function (action, context) {
        requireFunction(action, '"action" is not a function');

        context = context || this;

        while (this.hasNext()) {
            action.apply(context, [this.next()]);
        }
    },
    /**
     * Returns true if the next call to 'next' would not throw an exception
     * @returns {!boolean}
     */
    hasNext: function () {},
    /**
     * Returns the next entry
     * @returns {!*}
     * @throws RangeError
     */
    next: function () {},
    /**
     * Removes the current entry from the map
     * @throws Error
     */
    remove: function () {
        throw new Error('"remove" is not supported');
    }
};

// Module exports.

module.exports = Iterator;
