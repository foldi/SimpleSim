/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function World(el, opt_options) {

  var options = opt_options || {},
      viewportSize = exports.Utils.getViewportSize();

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for a new World.');
  }

  this.el = el;
  this.el.className = 'world';
  this.width = options.width || viewportSize.width;
  this.height = options.height || viewportSize.height;
  this.location = options.location || new exports.Vector(viewportSize.width / 2,
      viewportSize.height / 2);
  this.angle = options.angle === undefined ? 0 : options.angle;
  this.gravity = options.gravity || new exports.Vector(0, 0.1);
  this.wind = options.wind || new exports.Vector();
  this.thermal = options.thermal || new exports.Vector();
  this.color = options.color || [230, 230, 230];
  this.visibility = options.visibility || 'visible';
  this.cacheVector = new exports.Vector();
  this.pauseStep = false;
  this.camera = new exports.Vector();

  this._pool = []; // object pool
}

/**
 * Worlds do not have worlds. However, assigning a
 * blank object avoid coding extra logic in System._update.
 */
World.prototype.world = {};

/**
 * Updates properties.
 */
World.prototype.step = function() {};

/**
 * Updates the corresponding DOM element's style property.
 */
World.prototype.draw = function() {
  exports.System._draw(this);
};
