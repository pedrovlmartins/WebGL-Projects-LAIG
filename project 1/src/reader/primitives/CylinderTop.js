/**
 * Class CylinderTop
 * 
 * Creates and draws the top/bottom of a cylinder primitive given the parameters
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 */
function CylinderTop(scene, radius, slices) {
    CGFobject.call(this, scene);

    this.radius = radius; // given by mother cylinder as a parameter (either top or bottom)
    this.slices = slices; // same as mother cylinder

    this.initBuffers();
};

CylinderTop.prototype = Object.create(CGFobject.prototype);
CylinderTop.prototype.constructor = CylinderTop;

/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the cylinder top/bottom)
 * Overwrites the default initBuffers function.
 */
CylinderTop.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.unslicedTextCoords = [];

    for (i = 0, indicesFactor = 9; i < this.slices; i++, indicesFactor += 9) {
        var x1 = Math.cos(2 * Math.PI / this.slices * i);
        var x2 = Math.cos(2 * Math.PI / this.slices * (i + 1));
        var y1 = Math.sin(2 * Math.PI / this.slices * i);
        var y2 = Math.sin(2 * Math.PI / this.slices * (i + 1));

        // defines the vertices
        this.vertices.push(
            x1 * this.radius,
            y1 * this.radius,
            0);
        this.vertices.push(
            x2 * this.radius,
            y2 * this.radius,
            0);
        this.vertices.push(
            0,
            0,
            0);

        // defines the normals
        this.normals.push(
            0, 0, 1,
            0, 0, 1,
            0, 0, 1);

        // defines the indices
        this.indices.push(
            (indicesFactor / 3) - 3,
            (indicesFactor / 3) - 2,
            (indicesFactor / 3) - 1);

        // defines the texture coordinates
        this.unslicedTextCoords.push(
            0.5 + (x1 / 2),
            0.5 - (y1 / 2));
        this.unslicedTextCoords.push(
            0.5 + (x2 / 2),
            0.5 - (y2 / 2));
        this.unslicedTextCoords.push(0.5, 0.5);
        this.texCoords = this.unslicedTextCoords.slice();
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * Amplify the texture of the primitive given its values.
 * Not required. Exists only to avoid inheritance error.
 * @param lenghtS the length along S 
 * @param lenghtT the length along T
 */
CylinderTop.prototype.setSandT = function(lenghtS, lenghtT) {
    this.updateTexCoordsGLBuffers();
}