/**
 * Interface class, creating a GUI interface.
 * @constructor
 */
function Interface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
Interface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 * @param {Array} lights the collection of lights
 */
Interface.prototype.addVisualOptions = function(lights) {
    var group = this.gui.addFolder("Visual Options");
    group.open();

	var Movie = function(scene) {
		this.movie = function() {
			scene.playMovie();
		}
		};
	
	var movie = new Movie(this.scene);

	group.add(this.scene, 'activeCamera', ['Front', 'Top']).name("Camera");
	group.add(this.scene, 'activeBackground', ['Room', 'Casino', 'Beach']).name("Background");
	group.add(movie, 'movie').name("Replay game");
}

Interface.prototype.addGameOptions = function(lights) {
    var group = this.gui.addFolder("Game Options");
    group.open();
	
	var Start = function(scene) {
		this.start = function() {
			scene.startGame();
		}
		};
	
	var start = new Start(this.scene);

	var Undo = function(scene) {
		this.undo = function() {
			scene.undo();
		}
		};
	
	var undo = new Undo(this.scene);
	
	group.add(start, 'start').name("Start game");
	group.add(this.scene, 'gameMode', ['Human vs Human', 'Human vs Bot', 'Bot vs Bot']).name("Game mode");
	group.add(this.scene, 'botType', ['Cell selection', 'King capture']).name("Bot type");
	group.add(undo, 'undo').name("Undo last move");
}