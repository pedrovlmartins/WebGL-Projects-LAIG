/**
 * Class Triangle
 * 
 * Creates and draws a primitive of triangle type given the parameters.
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 */
function Triangle(scene, x0, y0, z0, x1, y1, z1, x2, y2, z2) {
    CGFobject.call(this, scene);

    this.p1 = [x0, y0, z0];
    this.p2 = [x1, y1, z1];
    this.p3 = [x2, y2, z2];

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the triangle primitive).
 * Overwrites the default initBuffers function.
 */
Triangle.prototype.initBuffers = function() {
    // defines the vertices	
    this.vertices = [
        this.p1[0], this.p1[1], this.p1[2],
        this.p2[0], this.p2[1], this.p2[2],
        this.p3[0], this.p3[1], this.p3[2]
    ];

    // defines the normals
    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    // defines the indices
    this.indices = [
        0, 
		1, 
		2
    ];

    // defines the texture coordinates
    var a = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
        (this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
        (this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));
    var b = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
        (this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
        (this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));
    var c = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
        (this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
        (this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

    var beta = Math.acos((a * a - b * b + c * c) / (2 * a * c));

    this.unslicedTextCoords = [
        0, 0,
        c, 0,
        c - a * (a * a - b * b + c * c) / (2 * a * c), -a * Math.sin(beta)
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
Triangle.prototype.setSandT = function(lenghtS, lenghtT) {
    for (var i = 0; i < this.unslicedTextCoords.length; i++) {

        if (i % 2 == 0) // if i is even, divide by lenghtS
            this.texCoords[i] = this.unslicedTextCoords[i] / lenghtS;
        else // else, if i is odd, divide by lenghtT
            this.texCoords[i] = this.unslicedTextCoords[i] / lenghtT;
    }
    this.updateTexCoordsGLBuffers();
}