/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.lightValues = {};
    this.optionValues = {};
	this.optionValues["Shaders on/off"] = true;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.startTime = 0; // the starting time , starts at 0.
    this.theActiveShader = 0; // the shader currently active, related with the interface.
    this.interfaceColor = 0; // the color currently selected, related with the interface.
	this.shadersAllowed = true;

    // starts one shader, to be used alongside the components drawing
    this.myShader = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.myShader.setUniformsValues({
        normScale: 0.0, // default normScale (starting time as 1)
        selectedColor: [1.0, 1.0, 1.0, 1.0] // default selectedColor (color white)
    });

    this.axis = new CGFaxis(this);

    this.materialDefault = new CGFappearance(this);
};

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break; // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];

            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();

            i++;
        }
    }
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(60, 40, 120), vec3.fromValues(10, 0, 30));
};

/**
 * Sets the default appearance of the ambient
 */
XMLscene.prototype.setDefaultAppearance = function() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() {
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this, this.graph.referenceLength);
    this.selectables = this.graph.selectables;

    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
        this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);

    // Adds shaders group. 
    this.interface.addShaders(this.graph.selectables);

    // Adds the color selection option to the shaders.
    this.interface.addColorOption(this.graph.selectables);

    // Adds the color selection option to the shaders.
    this.interface.addOptions(this.optionValues);

    this.materials = [];

    // Adds materials
    for (var i = 0; i < this.graph.materials.length; i++) {
        this.materials[i] = new CGFappearance(this);
        this.materials[i].materialId = this.graph.materials[i].materialID;
        this.materials[i].setShininess(this.graph.materials[i].shininess);
        this.materials[i].setEmission(this.graph.materials[i].emission[0], this.graph.materials[i].emission[1], this.graph.materials[i].emission[2], this.graph.materials[i].emission[3]);
        this.materials[i].setAmbient(this.graph.materials[i].ambient[0], this.graph.materials[i].ambient[1], this.graph.materials[i].ambient[2], this.graph.materials[i].ambient[3]);
        this.materials[i].setDiffuse(this.graph.materials[i].diffuse[0], this.graph.materials[i].diffuse[1], this.graph.materials[i].diffuse[2], this.graph.materials[i].diffuse[3]);
        this.materials[i].setSpecular(this.graph.materials[i].specular[0], this.graph.materials[i].specular[1], this.graph.materials[i].specular[2], this.graph.materials[i].specular[3]);
    }

    this.textures = [];

    // Adds textures
    for (var i = 0; i < this.graph.textures.length; i++) {
        this.textures[i] = new CGFappearance(this);

        this.textures[i].id = this.graph.textures[i].textureID;

        this.textures[i].loadTexture(this.graph.textures[i].filepath);
        this.textures[i].s = this.graph.textures[i].amplifFactorS;
        this.textures[i].t = this.graph.textures[i].amplifFactorT;
    }

    this.animations = [];

    // Adds the linear animations
    for (var i = 0; i < this.graph.linearAnimations.length; i++) {
        var animation = this.graph.linearAnimations[i];
        var id = animation.animationID;
        var speed = animation.animationSpeed;
        var controlPoints = animation.controlPoints;

        this.animations[id] = ['linear', speed, controlPoints];
    }

    // Adds the circular animations
    for (var i = 0; i < this.graph.circularAnimations.length; i++) {
        var animation = this.graph.circularAnimations[i];
        var id = animation.animationID;
        var speed = animation.animationSpeed;
        var x = animation.centerX;
        var y = animation.centerY;
        var z = animation.centerZ;
        var radius = animation.radius;
        var startang = animation.startAngle;
        var rotang = animation.rotationAngle;

        this.animations[id] = ['circular', speed, x, y, z, radius, startang, rotang];
    }

    // Adds the bezier animations
    for (var i = 0; i < this.graph.bezierAnimations.length; i++) {
        var animation = this.graph.bezierAnimations[i];
        var id = animation.animationID;
        var speed = animation.animationSpeed;
        var controlPoints = animation.controlPoints;

        this.animations[id] = ['bezier', speed, controlPoints];
    }

    // Adds the combo animations
    for (var i = 0; i < this.graph.comboAnimations.length; i++) {
        var animation = this.graph.comboAnimations[i];
        var id = animation.animationID;
        var spanrefs = animation.spanrefs;
		
        this.animations[id] = ['combo', spanrefs];
    }
	
    // Starts drawing the components after the graph is loaded
    this.rootComponent = new Component(this, this.graph.nodes[this.graph.nodes.length - 1]);

    this.setUpdatePeriod(100 / 6);
};

/* Update function, used to keep track of the time and do the animations and the shading actions.
 * @param currTime The current time, in milliseconds.
 */
XMLscene.prototype.update = function(currTime) {
    if (this.startTime == 0)
        this.startTime = currTime; // places the starting time the same as the current time

    // elapsed time, in milliseconds, define as the difference between the current time and the starting time
    this.elapsedTime = (currTime - this.startTime) / 1000;

    var interfaceColor = this.interfaceColor.Color; // the color dinamically chosen at the interface
    var saturatedColor = this.hexToRGBA(interfaceColor); // converts from hex to RGBA

    /*
    	TRIGONOMETRY FUNCTION USED = (sin PI * t) ^ 2
    	the trigonometry function used to calculate the value which will be used in the shader.
    	this value is the mathematical sine of the time multiplied by Math.PI.
    	this ensures that the value will always be between -1 and 1
    	by having it to the power of 2, we ensure the value will always be between 0 and 1.
    	this allows for either the same size (when the value is 0) or the duplicated size (when the value is 1)
    */

    var value = Math.pow(Math.sin(this.elapsedTime * Math.PI), 2);

    this.myShader.setUniformsValues({
        normScale: value, // sets the value calculated above
        selectedColor: saturatedColor // sets the current color chosen in the interface
    });
}

/* Converts a value in hexadecimal to its correspondent in RGBA. Assumes A as always 1.
 * @param hex The color value in hexadecimal
 * @return The color value converted from hexadecimal to RGBA
 */
XMLscene.prototype.hexToRGBA = function(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;

    return [r, g, b, 1];
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Applies the default material
    this.materialDefault.apply();

    this.pushMatrix();

    if (this.graph.loadedOk) {
        // Draw axis
        this.axis.display();

        var i = 0;

        // Turns lights on/off according to the information in the XML
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                } else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        for (var key in this.optionValues) {
            if (this.optionValues.hasOwnProperty(key)) {
                if (this.optionValues[key]) {
					if (key == "Shaders on/off")
						this.shadersAllowed = true;
                } else {
					if (key == "Shaders on/off")
						this.shadersAllowed = false;
                }
            }
        }

        // Displays the scene.
        this.graph.displayScene(this.elapsedTime);
    } else {
        // Draw axis
        this.axis.display();
    }

    this.popMatrix();

    // sets the default appearance of the scene.
    this.setDefaultAppearance();

    // ---- END Background, camera and axis setup
};