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

     // add a group of controls (and open/expand by defult)

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