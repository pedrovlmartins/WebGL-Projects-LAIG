function Rectangle(scene, point1, point2, minS, maxS, minT, maxT) {
    CGFobject.call(this, scene);

    this.point1 = point1;
    this.point2 = point2;

    if (typeof minS == 'undefined') {
        this.minS = 0;
    } else {
        this.minS = minS;
    }

    if (typeof maxS == 'undefined') {
        this.maxS = 1;
    } else {
        this.maxS = maxS;
    }

    if (typeof minT == 'undefined') {
        this.minT = 0;
    } else {
        this.minT = minT;
    }

    if (typeof maxT == 'undefined') {
        this.maxT = 1;
    } else {
        this.maxT = maxT;
    }

    this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {
    this.vertices = [this.point1[0], this.point1[1], 0, //0
        this.point1[0], this.point2[1], 0, //1
        this.point2[0], this.point1[1], 0, //2
        this.point2[0], this.point2[1], 0 //3
    ];

    this.indices = [
        2, 1, 0,
        3, 1, 2
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1

    ];

    this.originalTexCoords = [
        this.minS, this.maxT,
        this.minS, this.minT,
        this.maxS, this.maxT,
        this.maxS, this.minT
    ];

    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Rectangle.prototype.setSandT = function(amplifierS, amplifierT) {
    for (var i = 0; i < this.originalTexCoords.length; i += 2) {
        this.texCoords[i] = this.originalTexCoords[i] / amplifierS;
        this.texCoords[i + 1] = this.originalTexCoords[i + 1] / amplifierT;
    }

    this.updateTexCoordsGLBuffers();
};