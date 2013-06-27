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
        size = 1 * index;
    options.width = size;
    options.height = size;
    options.color = [SimpleSim.Utils.getRandomNumber(0, 255), 0, 0];
    SimpleSim.Item.call(this, options);
	}
  SimpleSim.Utils.extend(Pebble, SimpleSim.Item);

  exports.Pebble = Pebble;

}(exports));