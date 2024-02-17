"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return maximizeIterator;
    }
});
var _createProcessor = /*#__PURE__*/ _interop_require_default(require("./createProcessor"));
var _iteratornextcallback = /*#__PURE__*/ _interop_require_default(require("iterator-next-callback"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var DEFAULT_CONCURRENCY = 4096;
var DEFAULT_LIMIT = Infinity;
var MAXIMUM_BATCH = 10;
function maximizeIterator(iterator, fn, options, callback) {
    if (typeof fn !== "function") throw new Error("Missing each function");
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    if (typeof callback === "function") {
        options = options || {};
        options = {
            each: fn,
            callbacks: options.callbacks || options.async,
            concurrency: options.concurrency || DEFAULT_CONCURRENCY,
            limit: options.limit || DEFAULT_LIMIT,
            batch: options.batch || MAXIMUM_BATCH,
            error: options.error || function() {
                return true; // default is exit on error
            },
            total: 0,
            counter: 0,
            stop: function(counter) {
                return counter > options.batch;
            }
        };
        var processor = (0, _createProcessor.default)((0, _iteratornextcallback.default)(iterator), options, function processorCallback(err) {
            options = null;
            processor = null;
            return callback(err);
        });
        processor();
    } else {
        return new Promise(function(resolve, reject) {
            maximizeIterator(iterator, fn, options, function(err) {
                err ? reject(err) : resolve();
            });
        });
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}