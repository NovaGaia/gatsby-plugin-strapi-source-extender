"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _StrapiExtentedUtils$;

/**
 * Methode who create Array and sort it by order.
 * @param {*} dz Object corresponding to the Dynamic Zone
 * @returns Array of data, ordered by `order`
 */
StrapiExtentedUtils.objectToArray = function (dz) {
  var dzSanitized = [];
  Object.keys(dz).forEach(function (key) {
    return dzSanitized.push(dz[key]);
  });
  dzSanitized.sort(function (a, b) {
    return a.order - b.order;
  });
  return dzSanitized;
};

function StrapiExtentedUtils() {
  throw 'Do not use directly, use helper methods.';
}

StrapiExtentedUtils.objectToArray.propTypes = (_StrapiExtentedUtils$ = {
  dz: _propTypes["default"].object.isRequired
}, _StrapiExtentedUtils$["dz"] = _propTypes["default"].shape({
  order: _propTypes["default"].number.isRequired,
  __typename: _propTypes["default"].string.isRequired
}), _StrapiExtentedUtils$);
var _default = StrapiExtentedUtils;
exports["default"] = _default;