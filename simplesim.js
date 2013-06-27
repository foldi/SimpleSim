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

    exports.Utils._addEvent(window, 'resize', function(e) {
      System._resize.call(System, e);
    });

    exports.Utils._addEvent(window, 'devicemotion', function(e) {

      var world = System._records.list[0],
          x = e.accelerationIncludingGravity.x,
          y = e.accelerationIncludingGravity.y;

      if (window.orientation === 0) {
        world.gravity.x = x;
        world.gravity.y = y * -1;
      } else if (window.orientation === -90) {
        world.gravity.x = y;
        world.gravity.y = x;
      } else {
        world.gravity.x = y * -1;
        world.gravity.y = x * -1;
      }
    });
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

  /**
   * Repositions all items relative to the viewport size and resets the world bounds.
   */
  System._resize = function() {

    var i, max, records = this._records.list, record,
        viewportSize = exports.Utils.getViewportSize(),
        world = records[0];

    for (i = 1, max = records.length; i < max; i++) {
      record = records[i];
      record.location.x = viewportSize.width * (record.location.x / world.width);
      record.location.y = viewportSize.height * (record.location.y / world.height);
    }

    world.width = viewportSize.width;
    world.height = viewportSize.height;
    world.location = new exports.Vector((viewportSize.width / 2),
      (viewportSize.height / 2));
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
   * @param {Object} options= A map of initial properties.
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
    this.maxSpeed = options.maxSpeed || 5;
    this.bounciness = 0.8;
  };

  /**
   * Updates properties.
   */
  Item.prototype.step = function() {
    this.applyForce(this.world.wind);
    this.applyForce(this.world.thermal);
    this.applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this._checkWorldEdges();
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
        height = this.height,
        bounciness = this.bounciness;

    if (location.x + width / 2 > world.width) {
      location.x = world.width - width / 2;
      velocity.x *= -1 * bounciness;
    } else if (location.x < width / 2) {
      location.x = width / 2;
      velocity.x *= -1 * bounciness;
    }

    if (location.y + height / 2 > world.height) {
      location.y = world.height - height / 2;
      velocity.y *= -1 * bounciness;
    } else if (location.y < height / 2) {
      location.y = height / 2;
      velocity.y *= -1 * bounciness;
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

  /**
   * Adds an event listener.
   *
   * @param {Object} target The element to receive the event listener.
   * @param {string} eventType The event type.
   * @param {function} The function to run when the event is triggered.
   * @private
   */
  Utils._addEvent = function(target, eventType, handler) {
    if (target.addEventListener) { // W3C
      target.addEventListener(eventType, handler, false);
    } else if (target.attachEvent) { // IE
      target.attachEvent("on" + eventType, handler);
    }
  };

  /**
   * Extends the properties and methods of a superClass onto a subClass.
   *
   * @param {Object} subClass The subClass.
   * @param {Object} superClass The superClass.
   */
  Utils.extend = function(subClass, superClass) {
    function F() {}
    F.prototype = superClass.prototype;
    subClass.prototype = new F;
    subClass.prototype.constructor = subClass;
  };

  /**
   * Generates a psuedo-random number within a range.
   *
   * @param {number} low The low end of the range.
   * @param {number} high The high end of the range.
   * @param {boolean} [flt] Set to true to return a float.
   * @returns {number} A number.
   */
  Utils.getRandomNumber = function(low, high, flt) {
    if (flt) {
      return Math.random()*(high-(low-1)) + low;
    }
    return Math.floor(Math.random()*(high-(low-1))) + low;
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
