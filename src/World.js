/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @constructor
 */
function World(el) {

  var viewportSize = exports.Utils.getViewportSize();

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for a new World.');
  }

  this.el = el;
  this.el.className = 'world';
  this.width = viewportSize.width;
  this.height = viewportSize.height;
  this.location = new exports.Vector(viewportSize.width / 2, viewportSize.height / 2);
  this.angle = 0;
  this.gravity = new exports.Vector(0, 0.1);
  this.wind = new exports.Vector();
  this.thermal = new exports.Vector(0, -0.025);
  this.color = [230, 230, 230];
  this.visibility ='visible';
  this.cacheVector = new exports.Vector();
  this.pauseStep = false;
  this.camera = new exports.Vector();
}

/**
 * Worlds do not have worlds. However, assigning a
 * blank object avoid coding extra logic in System._update.
 */
World.prototype.world = {};

/**
 * Updates properties.
 */
World.prototype.step = function() {
  var dx = exports.System.mouse.location.x - this.width / 2,
      dy = exports.System.mouse.location.y - this.height / 2;
  this.gravity.x = dx * 0.01;
  this.gravity.y = dy * 0.05;
};

/**
 * Updates the corresponding DOM element's style property.
 */
World.prototype.draw = function() {
  exports.System._draw(this);
};
