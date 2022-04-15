"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require('humps'),
    camelize = _require.camelize,
    pascalize = _require.pascalize;

var _pluginOptions = {};

exports.onPreInit = function (_ref, pluginOptions) {
  var reporter = _ref.reporter;
  reporter.info('Loaded gatsby-plugin-strapi-override');
  _pluginOptions.strapiTypes = pluginOptions.strapiTypes;
  _pluginOptions.seekedTypes = [];
  _pluginOptions.seekedTypesExt = [];
  _pluginOptions.postfix = pluginOptions.postfix;
  _pluginOptions.showLog = pluginOptions.showLog;

  if (pluginOptions.postfix === undefined || pluginOptions.postfix === '') {
    _pluginOptions.postfix = 'Ext';
    reporter.warn("postfix can't be unset, fallback to " + _pluginOptions.postfix);
  }

  if (pluginOptions.showLog === undefined || pluginOptions.showLog === '') {
    _pluginOptions.showLog = false;
  }

  for (var _iterator = _createForOfIteratorHelperLoose(pluginOptions.strapiTypes), _step; !(_step = _iterator()).done;) {
    var strapiTypes = _step.value;

    _pluginOptions.seekedTypes.push(strapiTypes.type);

    _pluginOptions.seekedTypesExt.push("" + strapiTypes.type + _pluginOptions.postfix);
  }

  reporter.info("strapiTypes to manage " + _pluginOptions.seekedTypes);
  reporter.info("use these types instead " + _pluginOptions.seekedTypesExt);
};

function onCreateNode(_x) {
  return _onCreateNode.apply(this, arguments);
}

function _onCreateNode() {
  _onCreateNode = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_ref2) {
    var node, reporter, createNode, createNodeId, createContentDigest, POST_NODE_TYPE, _node, _iterator2, _step2, _strapiType, _iterator3, _step3, _dz, dynamicZone, dynamicZoneArray, dynamicZoneJSON, position, _iterator4, _step4, component, _dynamicZoneArray$pus, name;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            node = _ref2.node, reporter = _ref2.reporter, createNode = _ref2.actions.createNode, createNodeId = _ref2.createNodeId, createContentDigest = _ref2.createContentDigest;

            if (!((node === null || node === void 0 ? void 0 : node.internal) === undefined)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            if (node.internal.type !== null && _pluginOptions.seekedTypes.indexOf(node.internal.type) > -1) {
              POST_NODE_TYPE = "" + node.internal.type + _pluginOptions.postfix;

              if (_pluginOptions.showLog) {
                reporter.info("Processing " + POST_NODE_TYPE);
                reporter.info("NodeId " + POST_NODE_TYPE + "-" + node.id);
              } // reporter.info(`>>>node.internal.type ${node.internal.type`})
              // reporter.info(`>>>POST_NODE_TYPE ${POST_NODE_TYPE}`)
              // working on a copy of object


              _node = JSON.parse(JSON.stringify(node)); // reporter.info(`>>>_node ${_node}`)
              // unshuffle all mixed components properties.
              // taking care only for selected types in _pluginOptions.strapiTypes

              for (_iterator2 = _createForOfIteratorHelperLoose(_pluginOptions.strapiTypes); !(_step2 = _iterator2()).done;) {
                _strapiType = _step2.value;

                // taking care only if as dynamicZones
                if (_strapiType.type === node.internal.type && _strapiType.dynamicZones) {
                  // taking car of the dynamic zone
                  for (_iterator3 = _createForOfIteratorHelperLoose(_strapiType.dynamicZones); !(_step3 = _iterator3()).done;) {
                    _dz = _step3.value;

                    if (_node[_dz] && _node[_dz].length > 0) {
                      dynamicZone = {};
                      dynamicZoneArray = [];
                      dynamicZoneJSON = [];
                      position = 0;

                      for (_iterator4 = _createForOfIteratorHelperLoose(_node[_dz]); !(_step4 = _iterator4()).done;) {
                        component = _step4.value;

                        if (component) {
                          name = camelize(component.strapi_component.replace('.', '_'));
                          component['_xtypename'] = pascalize(name);
                          component['order'] = position;
                          dynamicZone["" + name] = component;
                          dynamicZoneJSON.push(component);
                          dynamicZoneArray.push((_dynamicZoneArray$pus = {}, _dynamicZoneArray$pus[name] = component, _dynamicZoneArray$pus));
                          position++;
                        }
                      }

                      _node[_dz] = dynamicZoneArray; // Keep data as JSON for fallBack

                      _node[_dz + "JSON"] = JSON.parse(JSON.stringify(Object.assign({}, dynamicZoneJSON)));
                    }
                  }
                } // reporter.info(`${POST_NODE_TYPE} done!`)


                createNode((0, _extends2.default)({}, _node, {
                  id: createNodeId(POST_NODE_TYPE + "-" + node.id),
                  parent: null,
                  children: [],
                  internal: {
                    type: POST_NODE_TYPE,
                    content: JSON.stringify(_node),
                    contentDigest: createContentDigest(_node),
                    description: "Extended version of " + node.internal.type
                  }
                }));
              }
            }

            return _context2.abrupt("return");

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _onCreateNode.apply(this, arguments);
}

exports.onCreateNode = onCreateNode;

exports.sourceNodes = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref3) {
    var getNodes, actions, touchNode, existingNodes;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            getNodes = _ref3.getNodes, actions = _ref3.actions;
            touchNode = actions.touchNode; // Fetch existing strapi nodes

            existingNodes = getNodes().filter(function (n) {
              return n.internal.owner === "gatsby-plugin-strapi-source-extender";
            }); // Touch each one of them

            existingNodes.forEach(function (node) {
              return touchNode(node);
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}();