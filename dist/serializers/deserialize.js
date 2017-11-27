'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _humps = require('humps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deserializeRelationships() {
  var resources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var store = arguments[1];

  return resources.map(function (resource) {
    return deserializeRelationship(resource, store);
  });
}

function deserializeRelationship() {
  var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var store = arguments[1];

  if (resource) {
    var resourceType = (0, _humps.camelize)(resource.type);
    if (store[resourceType] && store[resourceType][resource.id]) {
      return deserialize((0, _extends3.default)({}, store[resourceType][resource.id], { meta: { loaded: true } }), store);
    }
  }

  return deserialize((0, _extends3.default)({}, resource, { meta: { loaded: false } }), store);
}

function deserialize(_ref, store) {
  var id = _ref.id,
      type = _ref.type,
      attributes = _ref.attributes,
      relationships = _ref.relationships,
      meta = _ref.meta;

  var resource = { _type: type, _meta: meta };

  if (id) resource['id'] = id;

  if (attributes) {
    resource = (0, _keys2.default)(attributes).reduce(function (resource, key) {
      resource[(0, _humps.camelize)(key)] = attributes[key];
      return resource;
    }, resource);
  }

  if (relationships) {
    resource = (0, _keys2.default)(relationships).reduce(function (resource, key) {
      var relatedResource = relationships[key].data;
      resource[(0, _humps.camelize)(key)] = function () {
        if (Array.isArray(relatedResource)) {
          return deserializeRelationships(relatedResource, store);
        } else {
          return deserializeRelationship(relatedResource, store);
        }
      };
      return resource;
    }, resource);
  }

  return resource;
}

exports.default = deserialize;