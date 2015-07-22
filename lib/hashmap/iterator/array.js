/**
 * HashMap - Array iterator class
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * Homepage: https://github.com/francisdesjardins/hashmap
 */

'use strict';

// Module dependencies.

var IteratorInterface = require('../interface/iterator');

var create = require('../../utils/create');
var requireInstanceOf = require('../../utils/requireInstanceOf');

// Module variable

var pk = {};

// Module definition.

/**
 * @param {!Array<*>} target
 * @constructor
 */
var ArrayIterator = function (target) {
    requireInstanceOf(target, Array, '"target" must be an Array');

    var privates = {
        current: null,
        currentIndex: -1,
        target: target,
        targetIndex: target.length - 1
    };

    this.length = target.length;

    this.privates = function (key) {
        if (key === pk) {
            return privates;
        }
    };
};

// Extend with IteratorInterface

ArrayIterator.prototype = create(IteratorInterface);

/**
 * Returns true if the next call to 'next' would not throw an exception
 * @returns {!boolean}
 */
ArrayIterator.prototype.hasNext = function () {
    var privates = this.privates(pk);

    return privates.currentIndex < privates.targetIndex;
};

/**
 * Returns the next entry
 * @returns {*}
 * @throws RangeError
 */
ArrayIterator.prototype.next = function () {
    var privates = this.privates(pk);

    if (!this.hasNext()) {
        throw new RangeError('the iteration has no more elements');
    }

    privates.currentIndex += 1;
    privates.current = privates.target[privates.currentIndex];

    return privates.current;
};

// Module exports.

module.exports = ArrayIterator;
