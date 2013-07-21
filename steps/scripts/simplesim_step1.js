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