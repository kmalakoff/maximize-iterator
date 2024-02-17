"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createProcessor: function() {
        return _createProcessor.default;
    },
    default: function() {
        return _default;
    }
});
var _createProcessor = /*#__PURE__*/ _interop_require_default(require("./createProcessor.js"));
var _maximizeIterator = /*#__PURE__*/ _interop_require_default(require("./maximizeIterator.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = _maximizeIterator.default;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}