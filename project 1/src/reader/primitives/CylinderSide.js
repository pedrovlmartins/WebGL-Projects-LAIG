/**
 * Class CylinderSide
 * 
 * Creates and draws the side of a cylinder primitive given the parameters
 * This side has no bottom and no top.
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 */
function CylinderSide(scene, height, bottomRadius, topRadius, stacks, slices) {
    CGFobject.call(this, scene);

    this.height = height;
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.stacks = stacks;
    this.slices = slices;

    this.initBuffers();
};

CylinderSide.prototype = Object.create(CGFobject.prototype);
CylinderSide.prototype.constructor = CylinderSide;

/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the cylinder side)
 * Overwrites the default initBuffers function.
 */
CylinderSide.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    for (i = 0; i <= this.stacks; i++) {
        for (j = 0; j < this.slices; j++) {

            // defines the vertices
            this.vertices.push(
                Math.cos(j * 2 * Math.PI / this.slices) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
                Math.sin(j * 2 * Math.PI / this.slices) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
                i / this.stacks * this.height);

            // defines the normals
            this.normals.push(
                Math.cos(j * 2 * Math.PI / this.slices),
                Math.sin(j * 2 * Math.PI / this.slices),
                0);

            // defines the texture coordinates
            this.texCoords.push(j / this.slices, i / this.stacks);
        }
    }

    // defines the indices
    for (i = 0; i < this.stacks; i++) {
        for (j = 0; j < this.slices - 1; j++) {
            this.indices.push(
                i * this.slices + j,
                i * this.slices + j + 1,
                (i + 1) * this.slices + j);

            this.indices.push(
                i * this.slices + j + 1,
                (i + 1) * this.slices + j + 1,
                (i + 1) * this.slices + j);
        }

        this.indices.push(
            i * this.slices + this.slices - 1,
            i * this.slices,
            (i + 1) * this.slices + this.slices - 1);

        this.indices.push(
            i * this.slices,
            i * this.slices + this.slices,
            (i + 1) * this.slices + this.slices - 1);
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
CylinderSide.prototype.setSandT = function(lenghtS, lenghtT) {
    this.updateTexCoordsGLBuffers();
}