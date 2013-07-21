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
   * Initializes the system and starts the update loop.
   *
   * @param {Function} opt_setup= Creates the initial system conditions.
   * @param {Object} opt_world= A reference to a DOM element representing the System world.
   */
	System.init = function(opt_setup, opt_world) {

		var setup = opt_setup || function () {},
      		world = opt_world || document.body;

		System._records.list.push(new exports.World(world));
		setup.call(this);
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
    this.width = viewportSize.width;
    this.height = viewportSize.height;
  }

	exports.World = World;

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
