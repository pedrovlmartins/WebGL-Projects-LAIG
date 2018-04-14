/**
 * Class Cylinder
 * 
 * Creates and draws a primitive of cylinder type given the parameters.
 * A cylinder is composed of its side and its optional bottom/top.
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 * @ constructor
 */
function Cylinder(scene, height, bottomRadius, topRadius, stacks, slices, hasTop, hasBottom) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.slices = slices;
    this.stacks = stacks;
    this.height = height;
    this.top = null;
    this.bottom = null;

    // first creates the cylinder side
    this.cylinderSide = new CylinderSide(scene, height, bottomRadius, topRadius, stacks, slices);

    // then if provided in the parameters, creates the bottom and the top
    if (hasTop)
        this.top = new CylinderTop(scene, topRadius, slices);

    if (hasBottom)
        this.bottom = new CylinderTop(scene, bottomRadius, slices);
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

/**
 * Displays the cylinder in the scene.
 * Overwrites the default display function to include the display of more than one element
 */
Cylinder.prototype.display = function() {
    // displays the side first
    this.cylinderSide.display();

    // displays the top (if provided)
    if (this.top != null) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top.display();
        this.scene.popMatrix();
    }

    // displays the bottom (if provided)
    if (this.bottom != null) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.bottom.display();
        this.scene.popMatrix();
    }
}

/**
 * Amplify the texture of the primitive components given its values.
 * Not required. Exists only to avoid inheritance error. Does nothing.
 */
Cylinder.prototype.setSandT = function(lenghtS, lenghtT) {
    this.cylinderSide.setSandT(lenghtS, lenghtT);

    if (this.top != null)
        this.top.setSandT(lenghtS, lenghtT);

    if (this.bottom != null)
        this.bottom.setSandT(lenghtS, lenghtT);
		
	this.updateTexCoordsGLBuffers(); 
}