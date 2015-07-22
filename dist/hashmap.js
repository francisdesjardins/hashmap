/**
 * HashMap - HashMap JavaScript class inspired by JDK 8 HashMap class
 * @author Francis Desjardins <me@francisdesjardins.ca>
 * @version 0.0.1
 * Homepage: https://github.com/francisdesjardins/hashmap
 *
 * Key hashing, tests and 'did not knew that' highly inspired by
 * - HashMap by Ariel Flesler https://github.com/flesler/hashmap
 *
 * Implementation and Documentation highly inspired by OpenJDK
 * - http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/util/HashMap.java#HashMap
 * - http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/util/Map.java#Map
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
            (function(global) {
                "use strict";
                var ArrayIterator = require("./hashmap/iterator/array");
                var extend = require("xtend");
                var is = require("./utils/is");
                var isNot = require("./utils/isNot");
                var requireDefined = require("./utils/requireDefined");
                var requireFunction = require("./utils/requireFunction");
                var requireInstanceOf = require("./utils/requireInstanceOf");
                var hash = require("./utils/hash");
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                var defaultOptions = {};
                var pk = {};
                var previousHashMap = global.HashMap;
                function HashMap(map, options) {
                    var privates = {
                        map: {},
                        settings: extend({}, defaultOptions, options)
                    };
                    this.privates = function(key) {
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
                HashMap.noConflict = function() {
                    global.HashMap = previousHashMap;
                    return HashMap;
                };
                HashMap.prototype.clear = function() {
                    this.privates(pk).map = {};
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
                    var hashCode = hash(key), map = this.privates(pk).map;
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
                    return new ArrayIterator(entries);
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
                    var entries = this.entries(), entry;
                    while (entries.hasNext()) {
                        entry = entries.next();
                        if (entry.value === null) {
                            if (!(entry.key === null && o.containsKey(entry.key))) {
                                return false;
                            }
                        } else if (isNot(entry.value, o.get(entry.key))) {
                            return false;
                        }
                    }
                    return true;
                };
                HashMap.prototype.forEach = function(action, context) {
                    requireFunction(action, '"action" is not a function');
                    context = context || this;
                    var key, map = this.privates(pk).map;
                    for (key in map) {
                        if (hasOwnProperty.call(map, key)) {
                            if (action.apply(context, map[key]) === false) {
                                break;
                            }
                        }
                    }
                };
                HashMap.prototype.get = function(key) {
                    var hashCode = hash(key), map = this.privates(pk).map;
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
                    return new ArrayIterator(keys);
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
                    var hashCode = hash(key), map = this.privates(pk).map;
                    map[hashCode] = [ key, value ];
                    return value;
                };
                HashMap.prototype.putAll = function(map) {
                    requireInstanceOf(map, HashMap, '"map" is not an instance of HashMap');
                    var entries = map.entries(), entry;
                    while (entries.hasNext()) {
                        entry = entries.next();
                        this.put(entry.key, entry.value);
                    }
                };
                HashMap.prototype.putIfAbsent = function(key, value) {
                    var currentValue = this.get(key);
                    if (currentValue === null) {
                        currentValue = this.put(key, value);
                    }
                    return currentValue;
                };
                HashMap.prototype.remove = function(key) {
                    var currentValue = this.get(key), map = this.privates(pk).map;
                    delete map[hash(key)];
                    return currentValue;
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
                    var entries = this.entries(), entry, newValue;
                    while (entries.hasNext()) {
                        entry = entries.next();
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
                    return new ArrayIterator(values);
                };
                module.exports = HashMap;
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {
            "./hashmap/iterator/array": 4,
            "./utils/hash": 7,
            "./utils/is": 8,
            "./utils/isNot": 10,
            "./utils/requireDefined": 11,
            "./utils/requireFunction": 12,
            "./utils/requireInstanceOf": 13,
            xtend: 15
        } ],
        3: [ function(require, module, exports) {
            "use strict";
            var requireFunction = require("../../utils/requireFunction");
            var Iterator = {
                forEachRemaining: function(action, context) {
                    requireFunction(action, '"action" is not a function');
                    context = context || this;
                    while (this.hasNext()) {
                        action.apply(context, [ this.next() ]);
                    }
                },
                hasNext: function() {},
                next: function() {},
                remove: function() {
                    throw new Error('"remove" is not supported');
                }
            };
            module.exports = Iterator;
        }, {
            "../../utils/requireFunction": 12
        } ],
        4: [ function(require, module, exports) {
            "use strict";
            var IteratorInterface = require("../interface/iterator");
            var create = require("../../utils/create");
            var requireInstanceOf = require("../../utils/requireInstanceOf");
            var pk = {};
            var ArrayIterator = function(target) {
                requireInstanceOf(target, Array, '"target" must be an Array');
                var privates = {
                    current: null,
                    currentIndex: -1,
                    target: target,
                    targetIndex: target.length - 1
                };
                this.length = target.length;
                this.privates = function(key) {
                    if (key === pk) {
                        return privates;
                    }
                };
            };
            ArrayIterator.prototype = create(IteratorInterface);
            ArrayIterator.prototype.hasNext = function() {
                var privates = this.privates(pk);
                return privates.currentIndex < privates.targetIndex;
            };
            ArrayIterator.prototype.next = function() {
                var privates = this.privates(pk);
                if (!this.hasNext()) {
                    throw new RangeError("the iteration has no more elements");
                }
                privates.currentIndex += 1;
                privates.current = privates.target[privates.currentIndex];
                return privates.current;
            };
            module.exports = ArrayIterator;
        }, {
            "../../utils/create": 5,
            "../../utils/requireInstanceOf": 13,
            "../interface/iterator": 3
        } ],
        5: [ function(require, module, exports) {
            "use strict";
            var create = Object.create;
            if (typeof create !== "function") {
                create = function() {
                    function Temp() {}
                    var hasOwn = Object.prototype.hasOwnProperty;
                    return function(O) {
                        if (typeof O != "object") {
                            throw new TypeError("Object prototype may only be an Object or null");
                        }
                        Temp.prototype = O;
                        var obj = new Temp();
                        Temp.prototype = null;
                        if (arguments.length > 1) {
                            var Properties = Object(arguments[1]);
                            for (var prop in Properties) {
                                if (hasOwn.call(Properties, prop)) {
                                    obj[prop] = Properties[prop];
                                }
                            }
                        }
                        return obj;
                    };
                }();
            }
            module.exports = create;
        }, {} ],
        6: [ function(require, module, exports) {
            "use strict";
            var defineProperty = Object.defineProperty;
            if (typeof defineProperty !== "function") {
                defineProperty = function(obj, prop, descriptor) {
                    obj[prop] = descriptor.value;
                };
            }
            module.exports = defineProperty;
        }, {} ],
        7: [ function(require, module, exports) {
            "use strict";
            var defineProperty = require("./defineProperty");
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var isExtensible = require("./isExtensible");
            var typeOf = require("./type");
            var hash = function() {
                var identity = 0, identityProperty = "__hash_201506172259__", immutableTypeTest = {
                    undefined: 1,
                    "null": 1,
                    "boolean": 1,
                    nan: 1,
                    number: 1,
                    regexp: 1
                };
                function nextIdentity() {
                    identity += 1;
                    return identity;
                }
                return function(target) {
                    var hashes, i, length, type = typeOf(target);
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
                            hashes[i] = hash(target[i]);
                        }
                        return "♥" + hashes.join("⁞");

                      default:
                        if (!hasOwnProperty.call(target, identityProperty)) {
                            if (isExtensible(target)) {
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
                            } else {
                                throw new TypeError("Cannot use the given key, object is not extensible");
                            }
                        }
                        return "♦" + target[identityProperty];
                    }
                };
            }();
            module.exports = hash;
        }, {
            "./defineProperty": 6,
            "./isExtensible": 9,
            "./type": 14
        } ],
        8: [ function(require, module, exports) {
            "use strict";
            module.exports = function(x, y) {
                if (x === y) {
                    return x !== 0 || 1 / x === 1 / y;
                }
                return x !== x;
            };
        }, {} ],
        9: [ function(require, module, exports) {
            "use strict";
            var isExtensible = Object.isExtensible;
            if (typeof isExtensible !== "function") {
                isExtensible = function() {
                    return true;
                };
            }
            module.exports = isExtensible;
        }, {} ],
        10: [ function(require, module, exports) {
            "use strict";
            var is = require("./is");
            module.exports = function(x, y) {
                return !is(x, y);
            };
        }, {
            "./is": 8
        } ],
        11: [ function(require, module, exports) {
            "use strict";
            module.exports = function(o, m) {
                if (o === undefined) {
                    throw new ReferenceError(m);
                }
            };
        }, {} ],
        12: [ function(require, module, exports) {
            "use strict";
            module.exports = function(o, m) {
                if (typeof o !== "function") {
                    throw new TypeError(m);
                }
            };
        }, {} ],
        13: [ function(require, module, exports) {
            "use strict";
            module.exports = function(o, c, m) {
                if (!(o instanceof c)) {
                    throw new TypeError(m);
                }
            };
        }, {} ],
        14: [ function(require, module, exports) {
            "use strict";
            var toString = Object.prototype.toString;
            var typeRegEx = /\[object ([a-z]*)\]/gi;
            module.exports = function(target) {
                var type = toString.apply(target).replace(typeRegEx, "$1").toLowerCase();
                if (type === "number" && isNaN(target)) {
                    return "nan";
                }
                if (type === "object") {
                    switch (target) {
                      case null:
                        return "null";

                      case undefined:
                        return "undefined";

                      default:
                        return type;
                    }
                }
                return type;
            };
        }, {} ],
        15: [ function(require, module, exports) {
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
