function Room(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.point1 = [0, 0];
	this.point2 = [1, 1];
	this.trunk = new Rectangle(this.scene, this.point1, this.point2);
	this.table = new Rectangle(this.scene, this.point1, this.point2);
	this.wall = new Rectangle(this.scene, this.point1, this.point2);
};

Room.prototype = Object.create(CGFobject.prototype);
Room.prototype.constructor = Room;

Room.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 6, 1, 0, 0);
	this.scene.rotate(- Math.PI / 2, 1, 0, 0);
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(-16, -6, 0);
	this.scene.scale(16, 4, 1);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.trunk.setSandT(3, 3);
	this.trunk.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-28, -4, -0.1);
	this.scene.scale(40, 25, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.table.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 2, 0, 1, 0);	
	this.scene.translate(-10, -7, -12);
	this.scene.scale(25, 28, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.wallpaperTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.table.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(- Math.PI / 2, 1, 0, 0);	
	this.scene.translate(-12, -10, -6);
	this.scene.scale(45, 30, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.wallpaperTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.wall.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 0, 1);
	this.scene.rotate(Math.PI / 2, 0, 1, 0);	
	this.scene.translate(-10, -20, -28);
	this.scene.scale(45, 30, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.wallpaperTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.wall.display();
	this.scene.popMatrix();
}
