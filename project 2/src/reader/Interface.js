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

    this.testcolor = 0;

    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 * @param {Array} lights the collection of lights
 */
Interface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.close();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}

/**
 * Adds a section where the user can select the shaders.
 * @param {Shaders} the collection with the shaders read from the scene graph.
 */
Interface.prototype.addShaders = function(shaders) {
    this.gui.add(this.scene, 'theActiveShader', shaders).name('Shaders');

}

/**
 * Adds a section where the user can change the saturation color of the shader;
 */
Interface.prototype.addColorOption = function() {
    var Colors = function() {
        this.Color = "#ffffff"; // RGB with alpha
    };

    var colors = new Colors();
    this.gui.addColor(colors, "Color");
    this.scene.interfaceColor = colors;
}

/**
 * Adds a folder containing options regarding shaders and animations
 */
Interface.prototype.addOptions = function(options) {

    var group = this.gui.addFolder("Other options");
    group.close();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            this.scene.lightValues[key] = options[key][0];
            group.add(this.scene.optionValues, key);
        }
    }
}