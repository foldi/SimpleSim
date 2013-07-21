/*global exports*/
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
    this._stylePosition = '-webkit-transform: translate3d(<x>px, <y>px, 0) rotate(<a>deg); -moz-transform: translate3d(<x>px, <y>px, 0) rotate(<a>deg); -o-transform: translate3d(<x>px, <y>px, 0) rotate(<a>deg); -ms-transform: translate3d(<x>px, <y>px, 0) rotate(<a>deg);';
  } else if (supportedFeatures.csstransforms) {
    this._stylePosition = '-webkit-transform: translate(<x>px, <y>px) rotate(<a>deg); -moz-transform: translate(<x>px, <y>px) rotate(<a>deg); -o-transform: translate(<x>px, <y>px) rotate(<a>deg); -ms-transform: translate(<x>px, <y>px) rotate(<a>deg);';
  } else {
    this._stylePosition = 'position: absolute; left: <x>px; top: <y>px;';
  }

  System._records.list.push(new exports.World(world));

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

  exports.Utils._addEvent(window, 'keyup', function(e) {
    System._keyup.call(System, e);
  });

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };
  exports.Utils._addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

	setup.call(this);
  this._setup = setup;
  this._update();


};

/**
 * Handles keyup events.
 *
 * @param {Object} e An event.
 */
System._keyup = function(e) {

  var world = this._records.list[0];

  switch(e.keyCode) {
    case 39:
      System._stepForward(); // right arrow: step forward
    break;
    case 80: // p; pause/play
      world.pauseStep = !world.pauseStep;
      break;
    case 82: // r; reset
      System._resetSystem();
      break;
  }
};

/**
 * Saves the mouse velocity and location relative to the browser viewport.
 * @param {Object} e An event.
 * @private
 */
System._recordMouseLoc = function(e) {
  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;
  if (e.pageX && e.pageY) {
    this.mouse.location.x = e.pageX;
    this.mouse.location.y = e.pageY;
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = e.clientX;
    this.mouse.location.y = e.clientY;
  }
  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;
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
    record = records[i];
    if (!record.world.pauseStep) {
      record.step();
    }
  }

  for (i = records.length - 1; i >= 0; i -= 1) {
    records[i].draw();
  }
  window.requestAnimFrame(System._update);
};

/**
 * Pauses the system and processes one step in records.
 * @private
 */
System._stepForward = function() {

  var i, records = System._records.list,
      world = this._records.list[0];

  world.pauseStep = true;

  for (i = records.length - 1; i >= 0; i -= 1) {
    records[i].step();
  }
  for (i = records.length - 1; i >= 0; i -= 1) {
    records[i].draw();
  }
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
    visibility: obj.visibility,
    borderRadius: obj.borderRadius,
    a: obj.angle
  });
  obj.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @param {Object} props A map of object properties.
 */
System.getCSSText = function(props) {
  return this._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<a>/g, props.a) + ' width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      'rgb(' + props.color0 + ', ' + props.color1 + ', ' + props.color2 + ');' +
      'visibility: ' + props.visibility + '; border-radius: ' + props.borderRadius + '%';
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

/**
 * Resets the system.
 *
 * @param {boolean} opt_noRestart= Pass true to not restart the system.
 * @private
 */
System._resetSystem = function(opt_noRestart) {

  var world = this._records.list[0],
      viewportSize = exports.Utils.getViewportSize();

  world.pauseStep = false;
  while(world.el.firstChild) {
    world.el.removeChild(world.el.firstChild);
  }
  world.location = new exports.Vector((viewportSize.width / 2),
    (viewportSize.height / 2));
  this._records.list = this._records.list.splice(0, 1);
  System._setup.call(System);
};
