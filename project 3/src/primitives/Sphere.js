/**
 * MySphere
 * @method MySphere
 * @param   scene
 * @param   radius
 * @param   slices
 * @param   stacks
 */
 function Sphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;
	this.radius = radius;

 	this.initBuffers();
 };

/**
 * Create
 * @method create
 * @param   CGFobject.prototype
 * @return
 */
 Sphere.prototype = Object.create(CGFobject.prototype);

 /**
  * Constructor
  * @type
  */
 Sphere.prototype.constructor = Sphere;

/**
 * Init Buffers
 * @method function
 * @return
 */
 Sphere.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	// variables
	var height = 1;
	var delta_long = 2*Math.PI/this.slices;
	var delta_lat = Math.PI/this.stacks;
	var r = this.radius;
	var acc = 0;
	var index = 0;

	for(var i = 0; i <= this.stacks; i++){
		for(var j= 0; j <= this.slices; j++){
			var teta = Math.PI-i*delta_lat;
			this.vertices.push(
			r * Math.sin(teta) * Math.cos(j*delta_long),
			r * Math.sin(teta) * Math.sin(j*delta_long),
			r * Math.cos(teta)
			);
			this.normals.push(
				Math.sin(teta) * Math.cos(j*delta_long),
				Math.sin(teta) * Math.sin(j*delta_long),
				Math.cos(teta)
			);
			this.texCoords.push(
				j/this.slices,
				1 - i/this.stacks
			);
			index++;
		}
	}
	for(var i = 0; i < this.stacks; i++){
		acc = 0;
		for(var j = 0; j < this.slices; j++){

			this.indices.push(
				i*(this.slices + 1) +j,
				i*(this.slices + 1) +(j+1),
				(i+1)*(this.slices + 1) +(j+1)
			);
			this.indices.push(
				(i+1)*(this.slices + 1) +(j+1),
				(i+1)*(this.slices + 1) +j,
				i*(this.slices + 1) +j
				);

		}
	}

	if(this.bottom){
	var lowcenter = index++;
	this.vertices.push(
		0,
		0,
		0
	);
	this.normals.push(
		0,
		0,
		-1
	);
	var storedindex = index;
	//bottom

	for(var j= 0; j < this.slices-1; j++){
		this.vertices.push(
			r * Math.cos((j)*delta_long),
			r * Math.sin((j)*delta_long),
			0
			);
		this.vertices.push(
			r * Math.cos((j+1)*delta_long),
			r * Math.sin((j+1)*delta_long),
			0
			);
		this.indices.push(
		lowcenter, index+1, index
		);
		for(var rep = 0; rep < 2 ; rep++){
			this.normals.push(0,0,-1);
		}

		index+=2;
	}
	this.indices.push(storedindex,index-1,lowcenter);
 }
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 Sphere.prototype.setSandT = function (amplifierS, amplifierT) {
	this.updateTexCoordsGLBuffers();
};
