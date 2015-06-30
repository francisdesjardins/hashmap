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

var hasOwnProperty = Object.prototype.hasOwnProperty;
var requireFunction = require('./utils').requireFunction;
var requireInstanceOf = require('./utils').requireInstanceOf;
var split = String.prototype.split;
var type = require('./utils').typeOf;
var createKey = require('private-parts').createKey;

// Module variables.

var privates = createKey();

// Module definition.

/**
 * @param {Array|string} target
 * @param {Function} [remove]
 * @constructor
 * @throws TypeError
 */
function Iterator(target, remove) {
    privates(this).current = null;
    privates(this).currentIndex = -1;
    privates(this).target = (type(target) === 'string' ? split.call(target, '') : target);
    privates(this).targetIndex = target.length - 1;

    requireInstanceOf(privates(this).target, Array, '"target" must be an Array or a string');

    if (remove) {
        requireFunction(remove, '"remove" is not a function');

        this.remove = function () {
            remove.apply(this, [privates(this).currentIndex, privates(this).current]);
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
    return privates(this).currentIndex < privates(this).targetIndex;
};

/**
 * Returns the next entry
 * @returns {!*}
 * @throws RangeError
 */
Iterator.prototype.next = function () {
    if (!this.hasNext()) {
        throw new RangeError('the iteration has no more elements');
    }

    privates(this).current = privates(this).target[privates(this).currentIndex += 1];

    return privates(this).current;
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
