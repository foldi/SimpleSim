# SimpleSim: a simple JavaScript based natural simulator.

These are the raw files referenced in an article for Build New Games called "Simulating Natural Systems in a Web Browser."

http://buildnewgames.com/simulating-natural-systems/

You can view the final mobile simulator in here:

http://youtu.be/U9toZCg_7tM

You can find the raw files in the 'steps' folder. The release files for SimpleSim are in the 'release' folder.

The steps and links to view them in action are below:

#### Step 1

* Create project files.
* Create System class.
* Should throw an Error: 'undefined' is not a constructor (evaluating 'new exports.World(world)')

http://bl.ocks.org/foldi/5846012


#### Step 2

* Create a World class.
* Create Utils to hold utility functions.

http://bl.ocks.org/foldi/5846192


#### Step 3

* Create a System.add() method to add items to World.
* Should throw an Error: Item class does not exist.

http://bl.ocks.org/foldi/5846496


#### Step 4

* Create an Item class.

http://bl.ocks.org/foldi/5846530


#### Step 5

* Create a System._update() function to iterate over items and update their properties.
* Create System._draw() and System.getCSSText() functions to update items' style properties and render them in the browser's viewport.
* Add requestAnimFrame to create an animation loop.

http://bl.ocks.org/foldi/raw/5846794/


#### Step 6

* Add style rules in main.css
* Use modernizr to detect css transforms support.
* Create a css text string to use for positioning items.

http://bl.ocks.org/foldi/raw/5866038/


#### Step 7

* Add Vector library.
* Add acceleration property to Item.
* Add velocity property to Item.

http://bl.ocks.org/foldi/raw/5866589/


#### Step 8

* Add applyForce() function to Item and update Item.step().
* Add 'wind' and 'thermal' properties to World.
* Add 'mass' property to Item.
* Add Item.checkWorldEdges() function to keep items inside browser viewport.
* Use a cache vector in Item.applyForce() as an optimization.

http://bl.ocks.org/foldi/raw/5867007/


#### Step 9

* Add a resize event and handler to System.
* Add a devicemotion event and handler for mobile browsers.
* Update Item.step() to limit item velocity.
* Add 'bounciness' property to Item.
* Extend SimpleSim.Item to custom objects (Pebble and Boulder).
* Add 'borderRadius' property to Item to render round objects.
* Add 'angle' property to Item to render rotation.

http://bl.ocks.org/foldi/raw/5875349/


#### Step 10

* Add pause, reset and step forward playback controls.
* Add camera control.

http://bl.ocks.org/foldi/raw/5883853/


#### Step 11

* Adds mouse input to control World gravity.

http://bl.ocks.org/foldi/raw/5884986/




