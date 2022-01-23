"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require('humps'),
    pascalize = _require.pascalize,
    camelize = _require.camelize;

var _pluginOptions = {};

exports.onPreInit = function (_, pluginOptions) {
  console.log('Loaded gatsby-plugin-strapi-override');
  _pluginOptions.strapiTypes = pluginOptions.strapiTypes;
  _pluginOptions.seekedTypes = [];
  _pluginOptions.postfix = pluginOptions.postfix || 'Ext';

  if (pluginOptions.postfix === undefined || pluginOptions.postfix === '') {
    console.log("postfix can't be unset, fallback to", _pluginOptions.postfix);
  }

  for (var _iterator = _createForOfIteratorHelperLoose(pluginOptions.strapiTypes), _step; !(_step = _iterator()).done;) {
    var strapiTypes = _step.value;

    _pluginOptions.seekedTypes.push(strapiTypes.type);
  }

  console.log('strapiTypes to manage', _pluginOptions.seekedTypes);
};

exports.onCreateNode = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref) {
    var node, createNode, createNodeId, createContentDigest, POST_NODE_TYPE, _iterator2, _step2, _strapiType, _iterator3, _step3, _dz, dynamicZone, dynamicZoneJSON, position, _iterator4, _step4, component, name;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            node = _ref.node, createNode = _ref.actions.createNode, createNodeId = _ref.createNodeId, createContentDigest = _ref.createContentDigest;

            if (node.internal.type !== null && _pluginOptions.seekedTypes.indexOf(node.internal.type) > -1) {
              POST_NODE_TYPE = "" + node.internal.type + _pluginOptions.postfix;
              console.log('Processing', POST_NODE_TYPE); // unshuffle all mixed components properties.

              for (_iterator2 = _createForOfIteratorHelperLoose(_pluginOptions.strapiTypes); !(_step2 = _iterator2()).done;) {
                _strapiType = _step2.value;

                if (_strapiType.type === node.internal.type && _strapiType.dynamicZones) {
                  for (_iterator3 = _createForOfIteratorHelperLoose(_strapiType.dynamicZones); !(_step3 = _iterator3()).done;) {
                    _dz = _step3.value;

                    if (node[_dz] && node[_dz].length > 0) {
                      dynamicZone = {};
                      dynamicZoneJSON = [];
                      position = 0;

                      for (_iterator4 = _createForOfIteratorHelperLoose(node[_dz]); !(_step4 = _iterator4()).done;) {
                        component = _step4.value;

                        if (component) {
                          name = camelize(component.strapi_component.replace('.', '_')); // component['__typename'] = pascalize(name)

                          component['order'] = position;
                          dynamicZone[name] = component;
                          dynamicZoneJSON.push(component);
                          position++;
                        }
                      }

                      node[_dz] = dynamicZone; // Keep data as JSON for fallBack

                      node[_dz + "JSON"] = JSON.parse(JSON.stringify(Object.assign({}, dynamicZoneJSON)));
                    }
                  }
                }
              }

              createNode((0, _extends2.default)({}, node, {
                id: createNodeId(POST_NODE_TYPE + "-" + node.id),
                parent: null,
                children: [],
                internal: {
                  type: POST_NODE_TYPE,
                  content: JSON.stringify(node),
                  contentDigest: createContentDigest(node)
                }
              }));
            }

            return _context.abrupt("return");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();