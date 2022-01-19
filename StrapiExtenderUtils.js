"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _StrapiExtenderUtils$;

/**
 * Methode who create Array and sort it by order.
 * @param {*} dz Object corresponding to the Dynamic Zone
 * @returns Array of data, ordered by `order`
 */
StrapiExtenderUtils.objectToArray = function (dz) {
  var dzSanitized = [];
  Object.keys(dz).forEach(function (key) {
    return dz[key] ? dzSanitized.push(dz[key]) : '';
  });
  dzSanitized.sort(function (a, b) {
    return a.order - b.order;
  });
  return dzSanitized;
};

function StrapiExtenderUtils() {
  throw 'Do not use directly, use helper methods.';
}

StrapiExtenderUtils.objectToArray.propTypes = (_StrapiExtenderUtils$ = {
  dz: _propTypes["default"].object.isRequired
}, _StrapiExtenderUtils$["dz"] = _propTypes["default"].shape({
  order: _propTypes["default"].number.isRequired,
  __typename: _propTypes["default"].string.isRequired
}), _StrapiExtenderUtils$);
var _default = StrapiExtenderUtils;
exports["default"] = _default;