Rocks = {}; exports = Rocks;

(function(exports) {

  /**
   * Creates a new Pebble.
   *
   * @param {Object} [opt_options=] A map of initial properties.
   * @constructor
   */
	function Pebble(opt_options) {
    var options = opt_options || {},
        index = opt_options.index || 5,
        size = 15 + index;
    options.width = size;
    options.height = size;
    options.color = [SimpleSim.Utils.getRandomNumber(100, 255), SimpleSim.Utils.getRandomNumber(10, 100), 0];
    options.maxSpeed = 15;
    options.borderRadius = SimpleSim.Utils.getRandomNumber(40, 50);
    SimpleSim.Item.call(this, options);
	}
  SimpleSim.Utils.extend(Pebble, SimpleSim.Item);

  exports.Pebble = Pebble;

}(exports));

(function(exports) {

  /**
   * Creates a new Boulder.
   *
   * @param {Object} [opt_options=] A map of initial properties.
   * @constructor
   */
  function Boulder(opt_options) {
    var options = opt_options || {},
        index = opt_options.index || 5,
        size = 50 + 10 * index;
    options.width = size;
    options.height = size;
    options.color = [SimpleSim.Utils.getRandomNumber(100, 255), SimpleSim.Utils.getRandomNumber(100, 255), 0];
    options.maxSpeed = 15;
    options.borderRadius = SimpleSim.Utils.getRandomNumber(30, 40);
    SimpleSim.Item.call(this, options);
  }
  SimpleSim.Utils.extend(Boulder, SimpleSim.Item);

  exports.Boulder = Boulder;

}(exports));
