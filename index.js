
/**
 * Module dependencies.
 */

var ElementComponent = require('./lib/component/element');
var TextComponent = require('./lib/component/text');
var Component = require('./lib/component');
var renderer = require('./lib/renderer'); // hack ftm
var VirtualNode = require('./lib/node');

/**
 * DOM mapping.
 */

var elements = {
  text: TextComponent,
  default: ElementComponent
};

/**
 * Expose `dom`.
 */

exports = module.exports = createNode;
exports.dom = exports;

/**
 * Expose `component`.
 */

exports.component = Component;

/**
 * Expose `mount`.
 */

exports.mount = mount;

/**
 * Create virtual DOM trees
 *
 * @param {String} type
 * @param {Object} attributes
 * @param {Array} children
 *
 * @return {VirtualNode}
 */

function createNode(type, attributes, children) {
  var list = (children || []).map(normalize);
  // TODO: this can be abstracted away if we have another `Dom` object.
  if ('function' == typeof type) {
    var tagName = type.tagName;
  } else {
    var tagName = type;
    type = elements[type] || elements['default'];
  }
  var node = new VirtualNode(tagName, type, attributes, list);
  return node;
}

/**
 * Parse nodes into real VirtualNodes
 */

function normalize(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return createNode('text', node);
  }
  return node;
}

/**
 * Mount.
 */

function mount(type, attributes, container) {
  var node = createNode(type, attributes);
  var rootId = renderer.cache(container);
  node.create(rootId);
  var el = node.render();
  container.appendChild(el);
}
