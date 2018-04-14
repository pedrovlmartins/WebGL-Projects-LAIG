/**
 * Class Rectangle
 * 
 * Creates and draws a primitive of rectangle type given the parameters.
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 */
function Rectangle(scene, x1, y1, x2, y2) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;	
    this.x2 = x2;
    this.y2 = y2;

    this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the rectangle primitive).
 * Overwrites the default initBuffers function.
 */
Rectangle.prototype.initBuffers = function() {
	// defines the vertices	
    this.vertices = [
        this.x1, this.y2, 0,
        this.x2, this.y2, 0,
        this.x1, this.y1, 0,
        this.x2, this.y1, 0,
    ];

    // defines the normals
    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];

    // defines the indices
    this.indices = [
        0, 1, 2,
        3, 2, 1,
    ];

    // defines the texture coordinates
    this.unslicedTextCoords = [
        0, (this.y1 - this.y2),
        (this.x2 - this.x1), (this.y1 - this.y2),
        0, 0,
        (this.x2 - this.x1), 0,
    ];
    this.texCoords = this.unslicedTextCoords.slice();
	
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * Amplify the texture of the primitive given its values.
 * @param lenghtS the length along S 
 * @param lenghtT the length along T
 */
Rectangle.prototype.setSandT = function(lenghtS, lenghtT) {
	for (var i = 0; i < this.unslicedTextCoords.length; i++) {
		
		if (i % 2 == 0) // if i is even, divide by lenghtS
			this.texCoords[i] = this.unslicedTextCoords[i] / lenghtS;
		else // else, if i is odd, divide by lenghtT
			this.texCoords[i] = this.unslicedTextCoords[i] / lenghtT;
    }

    this.updateTexCoordsGLBuffers();
};