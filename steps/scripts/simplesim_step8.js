SimpleSim = {}; exports = SimpleSim;

(function(exports) {

  /** @namespace */
	var System = {
	  name: 'System'
	};

  /**
   * Stores references to all items in the system.
   * @private
   */
	System._records = {
	  lookup: {},
	  list: []
	};

  /**
   * Used to create unique ids.
   * @private
   */
	System._idCount = 0;

  /**
   * Holds a transform property based on supportedFeatures.
   * @private
   */
  System._stylePosition = '';

  /**
   * Increments idCount and returns the value.
   */
  System.getNewId = function() {
    this._idCount++;
    return this._idCount;
  };

  /**
   * Initializes the system and starts the update loop.
   *
   * @param {Function} opt_setup= Creates the initial system conditions.
   * @param {Object} opt_world= A reference to a DOM element representing the System world.
   * @param {Function} opt_supportedFeatures= A map of supported browser features.
   */
	System.init = function(opt_setup, opt_world, opt_supportedFeatures) {

		var setup = opt_setup || function () {},
      		world = opt_world || document.body,
          supportedFeatures = opt_supportedFeatures || null;

    if (supportedFeatures.csstransforms3d) {
      this._stylePosition = '-webkit-transform: translate3d(<x>px, <y>px, 0); -moz-transform: translate3d(<x>px, <y>px, 0); -o-transform: translate3d(<x>px, <y>px, 0); -ms-transform: translate3d(<x>px, <y>px, 0);';
    } else if (supportedFeatures.csstransforms) {
      this._stylePosition = '-webkit-transform: translate(<x>px, <y>px); -moz-transform: translate(<x>px, <y>px); -o-transform: translate(<x>px, <y>px); -ms-transform: translate(<x>px, <y>px);';
    } else {
      this._stylePosition = 'position: absolute; left: <x>px; top: <y>px;';
    }

		System._records.list.push(new exports.World(world));
		setup.call(this);
    this._update();
	};

  /**
   * Adds an object to the system.
   *
   * @param {Object} opt_options= Object properties.
   */
  System.add = function(klass, opt_options) {

    var last, records = this._records.list,
        recordsLookup = this._records.lookup,
        options = opt_options || {};

    options.world = records[0];

    if (exports[klass]) {
      records[records.length] = new exports[klass](options);
    } else if (exports.Classes[klass]) {
      records[records.length] = new exports.Classes[klass](options);
    } else {
      throw new Error(klass + ' class does not exist.');
    }

    last = records.length - 1;
    recordsLookup[records[last].id] = records[last].el.parentNode;
    records[last].init(options);
    return records[last];
  };

  /**
   * Iterates over objects in the system and calls step() and draw().
   * @private
   */
  System._update = function() {

    var i, records = System._records.list, record;

    for (i = records.length - 1; i >= 0; i -= 1) {
      records[i].step();
    }

    for (i = records.length - 1; i >= 0; i -= 1) {
      records[i].draw();
    }
    window.requestAnimFrame(System._update);
  };

  /**
   * Updates the corresponding DOM element's style property.
   */
  System._draw = function(obj) {

    var cssText = exports.System.getCSSText({
      x: obj.location.x - (obj.width / 2),
      y: obj.location.y - (obj.height / 2),
      width: obj.width,
      height: obj.height,
      color0: obj.color[0],
      color1: obj.color[1],
      color2: obj.color[2],
      visibility: obj.visibility
    });
    obj.el.style.cssText = cssText;
  };

  /**
   * Concatenates a new cssText string.
   *
   * @param {Object} props A map of object properties.
   */
  System.getCSSText = function(props) {
    return this._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y) + ' width: ' +
        props.width + 'px; height: ' + props.height + 'px; background-color: ' +
        'rgb(' + props.color0 + ', ' + props.color1 + ', ' + props.color2 + ');' +
        'visibility: ' + props.visibility + ';';
  };

	exports.System = System;

}(exports));


(function(exports) {

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
    this.gravity = new exports.Vector(0, 0.1);
    this.wind = new exports.Vector(0.05, 0);
    this.thermal = new exports.Vector(0, -0.025);
    this.color = 'transparent';
    this.visibility ='visible';
    this.cacheVector = new exports.Vector();
  }

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

	exports.World = World;

}(exports));


(function(exports) {

  /**
   * Creates a new Item.
   *
   * @param {Object} options A map of initial properties.
   * @constructor
   */
  function Item(options) {

    if (!options || !options.world || typeof options.world !== 'object') {
      throw new Error('Item: A valid DOM object is required for a new Item.');
    }

    this.world = options.world;
    this.name = options.name || 'Item';
    this.id = this.name + exports.System.getNewId();

    this.el = document.createElement('div');
    this.el.id = this.id;
    this.el.className = 'item ' + this.name.toLowerCase();
    this.el.style.visibility = 'hidden';
    this.world.el.appendChild(this.el);
  }

  /**
   * Initializes the object.
   */
  Item.prototype.init = function(opt_options) {

    var options = opt_options || {};

    this.acceleration = options.acceleration || new exports.Vector();
    this.velocity = options.velocity || new exports.Vector();
    this.location = options.location || new exports.Vector(this.world.width / 2, this.world.height / 2);
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.mass = (this.width * this.height) * 0.01;
    this.color = options.color || [0, 0, 0];
    this.visibility = options.visibility || 'visible';
    this.checkWorldEdges = options.checkWorldEdges === undefined ? true : options.checkWorldEdges;
  };

  /**
   * Updates properties.
   */
  Item.prototype.step = function() {
    this.applyForce(this.world.wind);
    this.applyForce(this.world.thermal);
    this.applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  };

  /**
  * Adds a force to this object's acceleration.
  *
  * @param {Object} force A Vector representing a force to apply.
  */
  Item.prototype.applyForce = function(force) {
    var vector = this.world.cacheVector;
    vector.x = force.x;
    vector.y = force.y;
    vector.div(this.mass);
    this.acceleration.add(vector);
  };

  /**
   * Determines if this object is outside the world bounds.
   * @private
   */
  Item.prototype._checkWorldEdges = function() {

    var world = this.world,
        location = this.location,
        velocity = this.velocity,
        width = this.width,
        height = this.height;

    if (location.x + width / 2 > world.width) {
      location.x = world.width - width / 2;
      velocity.x *= -1;
    } else if (location.x < width / 2) {
      location.x = width / 2;
      velocity.x *= -1;
    }

    if (location.y + height / 2 > world.height) {
      location.y = world.height - height / 2;
      velocity.y *= -1;
    } else if (location.y < height / 2) {
      location.y = height / 2;
      velocity.y *= -1;
    }
  };

  /**
   * Updates the corresponding DOM element's style property.
   */
  Item.prototype.draw = function() {
    exports.System._draw(this);
  };

  exports.Item = Item;

}(exports));


(function(exports) {

  var Utils = {};

  /**
   * Determines the size of the browser viewport.
   *
   * @returns {Object} The current browser viewport width and height.
   * @private
   */
  Utils.getViewportSize = function() {

    var d = {};

    if (typeof(window.innerWidth) !== 'undefined') {
      d.width = window.innerWidth;
      d.height = window.innerHeight;
    } else if (typeof(document.documentElement) !== 'undefined' &&
        typeof(document.documentElement.clientWidth) !== 'undefined') {
      d.width = document.documentElement.clientWidth;
      d.height = document.documentElement.clientHeight;
    } else if (typeof(document.body) !== 'undefined') {
      d.width = document.body.clientWidth;
      d.height = document.body.clientHeight;
    } else {
      d.width = undefined;
      d.height = undefined;
    }
    return d;
  };

  exports.Utils = Utils;

}(exports));


(function(exports) {

  var Classes = {};

  exports.Classes = Classes;

}(exports));

(function(exports) {

  /**
   * Creates a new Vector.
   *
   * @param {number} [opt_x = 0] The x location.
   * @param {number} [opt_y = 0] The y location.
   * @constructor
   */
  function Vector(opt_x, opt_y) {
    var x = opt_x || 0,
        y = opt_y || 0;
    this.x = x;
    this.y = y;
  }

  /**
   * Adds a vector to this vector.
   *
   * @param {Object} vector The vector to add.
   * @returns {Object} This vector.
   */
  Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  /**
   * Subtracts a vector from this vector.
   *
   * @param {Object} vector The vector to subtract.
   * @returns {Object} This vector.
   */
  Vector.prototype.sub = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  /**
   * Multiplies this vector by a passed value.
   *
   * @param {number} n Vector will be multiplied by this number.
   * @returns {Object} This vector.
   */
  Vector.prototype.mult = function(n) {
    this.x *= n;
    this.y *= n;
    return this;
  };

  /**
   * Divides this vector by a passed value.
   *
   * @param {number} n Vector will be divided by this number.
   * @returns {Object} This vector.
   */
  Vector.prototype.div = function(n) {
    this.x = this.x / n;
    this.y = this.y / n;
    return this;
  };

  /**
   * Calculates the magnitude of this vector.
   *
   * @returns {number} The vector's magnitude.
   */
  Vector.prototype.mag = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  };

  /**
   * Limits the vector's magnitude.
   *
   * @param {number} opt_high The upper bound of the vector's magnitude
   * @param {number} opt_low The lower bound of the vector's magnitude.
   * @returns {Object} This vector.
   */
  Vector.prototype.limit = function(opt_high, opt_low) {
    var high = opt_high || null,
        low = opt_low || null;
    if (high && this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
    if (low && this.mag() < low) {
      this.normalize();
      this.mult(low);
    }
    return this;
  };

  /**
   * Divides a vector by its magnitude to reduce its magnitude to 1.
   * Typically used to retrieve the direction of the vector for later manipulation.
   *
   * @returns {Object} This vector.
   */
  Vector.prototype.normalize = function() {
    var m = this.mag();
    if (m !== 0) {
      return this.div(m);
    }
  };

  /**
   * Rotates a vector using a passed angle in radians.
   *
   * @param {number} radians The angle to rotate in radians.
   * @returns {Object} This vector.
   */
  Vector.prototype.rotate = function(radians) {
    var cos = Math.cos(radians),
      sin = Math.sin(radians),
      x = this.x,
      y = this.y;

    this.x = x * cos - y * sin;
    this.y = x * sin + y * cos;
    return this;
  };

  exports.Vector = Vector;

}(exports));

/**
 * RequestAnimationFrame shim layer with setTimeout fallback
 * @param {function} callback The function to call.
 * @returns {function|Object} An animation frame or a timeout object.
 */
window.requestAnimFrame = (function(callback){

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();
