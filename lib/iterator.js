/**
 * HashMap - HashMap JavaScript class inspired by JDK 8 HashMap class
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * @version 0.0.1
 * Homepage: https://github.com/francisdesjardins/hashmap
 *
 * Key hashing, tests and 'did not knew that' highly inspired by
 * - HashMap by Ariel Flesler https://github.com/flesler/hashmap
 */

'use strict';

// Module dependencies.

var requireFunction = require('./utils/requireFunction');
var requireInstanceOf = require('./utils/requireInstanceOf');
var split = String.prototype.split;
var type = require('./utils/type');

// Module variables.

var pk = {};

// Module definition.

/**
 * @param {Array|string} target
 * @param {Function} [remove]
 * @constructor
 * @throws TypeError
 */
function Iterator(target, remove) {
    var privates = {
        current: null,
        currentIndex: -1,
        target: (type(target) === 'string' ? split.call(target, '') : target),
        targetIndex: target.length - 1
    };

    this.privates = function (key) {
        if (key === pk) {
            return privates;
        }
    };

    requireInstanceOf(privates.target, Array, '"target" must be an Array or a string');

    if (remove) {
        requireFunction(remove, '"remove" is not a function');

        this.remove = function () {
            remove.apply(this, [privates.currentIndex, privates.current]);
        };
    }
}

/**
 * Execute the given action on each remaining entries
 * @param action
 * @param {Object} [context=this]
 */
Iterator.prototype.forEachRemaining = function (action, context) {
    requireFunction(action, '"action" is not a function');

    context = context || this;

    while (this.hasNext()) {
        action.apply(context, [this.next()]);
    }
};

/**
 * Returns true if the next call to 'next' would not throw an exception
 * @returns {!boolean}
 */
Iterator.prototype.hasNext = function () {
    var privates = this.privates(pk);

    return privates.currentIndex < privates.targetIndex;
};

/**
 * Returns the next entry
 * @returns {!*}
 * @throws RangeError
 */
Iterator.prototype.next = function () {
    var privates = this.privates(pk);

    if (!this.hasNext()) {
        throw new RangeError('the iteration has no more elements');
    }

    privates.current = privates.target[privates.currentIndex += 1];

    return privates.current;
};

/**
 * Removes the current entry from the map
 * @throws Error
 */
Iterator.prototype.remove = function () {
    throw new Error('"remove" is not supported');
};

// Module exports.

module.exports = Iterator;
