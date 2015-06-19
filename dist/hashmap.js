/**
 * HashMap - HashMap JavaScript class inspired by JDK 8 HashMap class
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * @version 0.0.1
 * Homepage: https://github.com/francisdesjardins/hashmap
 *
 * Key hashing, tests and 'did not knew that' highly inspired by
 * - HashMap by Ariel Flesler https://github.com/flesler/hashmap
 */
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.HashMap = f();
    }
})(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(require, module, exports) {
            module.exports = require("./lib/hashmap");
        }, {
            "./lib/hashmap": 2
        } ],
        2: [ function(require, module, exports) {
            "use strict";
            var extend = require("xtend");
            var is = require("./utils").is;
            var isNot = require("./utils").isNot;
            var pop = Array.prototype.pop;
            var requireDefined = require("./utils").requireDefined;
            var requireFunction = require("./utils").requireFunction;
            var requireInstanceOf = require("./utils").requireInstanceOf;
            var hash = require("./utils").hash;
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var defaults = {
                cacheKeys: true
            };
            var pk = {};
            function HashMap(map, options) {
                var privates = {
                    map: {},
                    settings: extend({}, defaults, options)
                };
                this.pk = function(key) {
                    if (key === pk) {
                        return privates;
                    }
                };
                switch (arguments.length) {
                  case 0:
                    break;

                  case 1:
                    this.putAll(map);
                    break;

                  default:
                    throw new Error();
                }
            }
            HashMap.prototype.clear = function() {
                var privates = this.pk(pk);
                privates.map = {};
            };
            HashMap.prototype.clone = function() {
                return new HashMap(this);
            };
            HashMap.prototype.compute = function(key, remappingFunction, context) {
                requireFunction(remappingFunction, '"remappingFunction" is not a function');
                context = context || this;
                var oldValue = this.get(key), newValue = remappingFunction.apply(context, [ key, oldValue ]);
                requireDefined(newValue, '"newValue" is undefined');
                if (newValue === null) {
                    if (oldValue !== null || this.containsKey(key)) {
                        this.remove(key);
                    }
                    return null;
                }
                this.put(key, newValue);
                return newValue;
            };
            HashMap.prototype.computeIfAbsent = function(k, mappingFunction, context) {
                requireFunction(mappingFunction, '"mappingFunction" is not a function');
                context = context || this;
                var newValue, oldValue = this.get(k);
                if (oldValue === null) {
                    newValue = mappingFunction.apply(context, [ k ]);
                    requireDefined(newValue, '"newValue" is undefined');
                    if (newValue !== null) {
                        this.put(k, newValue);
                        return newValue;
                    }
                }
                return oldValue;
            };
            HashMap.prototype.computeIfPresent = function(key, remappingFunction, context) {
                requireFunction(remappingFunction, '"remappingFunction" is not a function');
                context = context || this;
                var oldValue = this.get(key), newValue;
                if (oldValue !== null) {
                    newValue = remappingFunction.apply(context, [ key, oldValue ]);
                    requireDefined(newValue, '"newValue" is undefined');
                    if (newValue !== null) {
                        this.put(key, newValue);
                        return newValue;
                    }
                    this.remove(key);
                }
                return null;
            };
            HashMap.prototype.containsKey = function(key) {
                var hashCode = hash(key), map = this.pk(pk).map;
                return hasOwnProperty.call(map, hashCode);
            };
            HashMap.prototype.containsValue = function(value) {
                var found = false;
                this.forEach(function(k, v) {
                    if (is(value, v)) {
                        found = true;
                        return !found;
                    }
                });
                return found;
            };
            HashMap.prototype.entries = function() {
                var entries = [];
                this.forEach(function(k, v) {
                    entries.push({
                        key: k,
                        value: v
                    });
                });
                return entries;
            };
            HashMap.prototype.equals = function(o) {
                if (o === this) {
                    return true;
                }
                if (!(o instanceof HashMap)) {
                    return false;
                }
                if (this.size() !== o.size()) {
                    return false;
                }
                var entries = this.entries(), entry, key, value;
                while ((entry = pop.apply(entries)) !== undefined) {
                    key = entry.key;
                    value = entry.value;
                    if (value === null) {
                        if (!(key === null && o.containsKey(key))) {
                            return false;
                        }
                    } else if (isNot(value, o.get(key))) {
                        return false;
                    }
                }
                return true;
            };
            HashMap.prototype.forEach = function(action, context) {
                requireFunction(action, '"action" is not a function');
                context = context || this;
                var key, map = this.pk(pk).map;
                for (key in map) {
                    if (hasOwnProperty.call(map, key)) {
                        if (action.apply(context, map[key]) === false) {
                            break;
                        }
                    }
                }
            };
            HashMap.prototype.get = function(key) {
                var hashCode = hash(key), map = this.pk(pk).map;
                if (hasOwnProperty.call(map, hashCode)) {
                    return map[hashCode][1];
                }
                return null;
            };
            HashMap.prototype.getOrDefault = function(key, value) {
                return this.containsKey(key) ? this.get(key) : value;
            };
            HashMap.prototype.isEmpty = function() {
                return !this.size();
            };
            HashMap.prototype.keys = function() {
                var keys = [];
                this.forEach(function(k) {
                    keys.push(k);
                });
                return keys;
            };
            HashMap.prototype.merge = function(key, value, remappingFunction, context) {
                requireFunction(remappingFunction, '"remappingFunction" is not a function');
                context = context || this;
                var newValue, oldValue;
                oldValue = this.get(key);
                newValue = oldValue === null ? value : remappingFunction.apply(context, [ oldValue, value ]);
                requireDefined(newValue, '"newValue" is undefined');
                if (newValue === null) {
                    this.remove(key);
                } else {
                    return this.put(key, newValue);
                }
                return newValue;
            };
            HashMap.prototype.put = function(key, value) {
                requireDefined(value, '"value" is undefined');
                var hashCode = hash(key), map = this.pk(pk).map;
                map[hashCode] = [ key, value ];
                return value;
            };
            HashMap.prototype.putAll = function(map) {
                requireInstanceOf(map, HashMap, '"map" is not an instance of HashMap');
                map.forEach(function(k, v) {
                    this.put(k, v);
                }, this);
            };
            HashMap.prototype.putIfAbsent = function(key, value) {
                var currentValue = this.get(key);
                if (currentValue === null) {
                    currentValue = this.put(key, value);
                }
                return currentValue;
            };
            HashMap.prototype.remove = function(key) {
                var currentValue, hashCode = hash(key), map = this.pk(pk).map;
                if (hasOwnProperty.call(map, hashCode)) {
                    currentValue = map[hashCode][1];
                    delete map[hashCode];
                    return currentValue;
                }
                return null;
            };
            HashMap.prototype.removeIfPresent = function(key, value) {
                var currentValue = this.get(key);
                if (isNot(currentValue, value) || currentValue === null && !this.containsKey(key)) {
                    return false;
                }
                this.remove(key);
                return true;
            };
            HashMap.prototype.replace = function(key, value) {
                var currentValue = this.get(key);
                if (currentValue !== null) {
                    return this.put(key, value);
                }
                return currentValue;
            };
            HashMap.prototype.replaceIfPresent = function(key, value, newValue) {
                var currentValue = this.get(key);
                if (isNot(currentValue, value) || currentValue === null && !this.containsKey(key)) {
                    return false;
                }
                this.put(key, newValue);
                return true;
            };
            HashMap.prototype.replaceAll = function(replacingFunction, context) {
                requireFunction(replacingFunction, '"replacingFunction" is not a function');
                context = context || this;
                var entry, entries, newValue;
                entries = this.entries();
                while ((entry = pop.apply(entries)) !== undefined) {
                    newValue = replacingFunction.apply(context, [ entry.key, entry.value ]);
                    if (newValue !== undefined) {
                        if (newValue === null) {
                            this.remove(entry.key);
                        } else {
                            this.put(entry.key, newValue);
                        }
                    }
                }
            };
            HashMap.prototype.size = function() {
                return this.keys().length;
            };
            HashMap.prototype.values = function() {
                var values = [];
                this.forEach(function(k, v) {
                    values.push(v);
                });
                return values;
            };
            module.exports = HashMap;
        }, {
            "./utils": 3,
            xtend: 4
        } ],
        3: [ function(require, module, exports) {
            "use strict";
            var defineProperty = Object.defineProperty;
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var random = Math.random;
            var toString = Object.prototype.toString;
            var typeOfRegEx = /\[object ([a-z]*)\]/gi;
            exports.hash = function() {
                var identity = 0, identityProperty = "__HashMap_201506172259__", immutableTypeTest = {
                    undefined: 1,
                    "null": 1,
                    "boolean": 1,
                    nan: 1,
                    number: 1,
                    regexp: 1
                };
                if (!defineProperty) {
                    defineProperty = function(obj, prop, descriptor) {
                        obj[prop] = descriptor.value;
                    };
                }
                function nextIdentity() {
                    identity += 1;
                    return identity;
                }
                return function(target) {
                    var hashes, i, length, type = exports.typeOf(target);
                    if (hasOwnProperty.call(immutableTypeTest, type)) {
                        return String(target);
                    }
                    switch (type) {
                      case "date":
                        return "♣" + target.getTime();

                      case "string":
                        return "♠" + target;

                      case "array":
                        hashes = [];
                        for (i = 0, length = target.length; i < length; i += 1) {
                            hashes[i] = exports.hash(target[i]);
                        }
                        return "♥" + hashes.join("⁞");

                      default:
                        if (!hasOwnProperty.call(target, identityProperty)) {
                            try {
                                defineProperty(target, identityProperty, {
                                    value: nextIdentity(),
                                    writable: false,
                                    configurable: false,
                                    enumerable: false
                                });
                            } catch (e) {
                                target[identityProperty] = nextIdentity();
                            }
                        }
                        return "♦" + target[identityProperty];
                    }
                };
            }();
            exports.identify = function() {
                var identity = 0;
                function nextIdentity() {
                    identity += 1;
                    return identity;
                }
                return function() {
                    return nextIdentity();
                };
            }();
            exports.is = function(x, y) {
                if (x === y) {
                    return x !== 0 || 1 / x === 1 / y;
                }
                return x !== x;
            };
            exports.isNot = function(x, y) {
                return !exports.is(x, y);
            };
            exports.now = Date.now || function() {
                return new Date().getTime();
            };
            exports.requireDefined = function(o, m) {
                if (o === undefined) {
                    throw new ReferenceError(m);
                }
            };
            exports.requireFunction = function(o, m) {
                if (typeof o !== "function") {
                    throw new TypeError(m);
                }
            };
            exports.requireInstanceOf = function(o, c, m) {
                if (!(o instanceof c)) {
                    throw new TypeError(m);
                }
            };
            exports.requireNonNull = function(o, m) {
                if (o === null) {
                    throw new ReferenceError(m);
                }
            };
            exports.typeOf = function(target) {
                var type = toString.apply(target).replace(typeOfRegEx, "$1").toLowerCase();
                if (type === "number" && isNaN(target)) {
                    return "nan";
                }
                return type;
            };
        }, {} ],
        4: [ function(require, module, exports) {
            module.exports = extend;
            function extend() {
                var target = {};
                for (var i = 0; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            }
        }, {} ]
    }, {}, [ 1 ])(1);
});
