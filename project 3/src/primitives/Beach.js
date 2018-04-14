function Beach(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.point1 = [0, 0];
	this.point2 = [1, 1];
	this.trunk = new Rectangle(this.scene, this.point1, this.point2);
	this.beach = new Rectangle(this.scene, this.point1, this.point2);
	this.towel = new Rectangle(this.scene, this.point1, this.point2);
	this.ball = new Sphere(this.scene, 1, 30, 30);
};

Beach.prototype = Object.create(CGFobject.prototype);
Beach.prototype.constructor = Beach;

Beach.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 6, 1, 0, 0);
	this.scene.rotate(- Math.PI / 2, 1, 0, 0);
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(-16, -6, 0);
	this.scene.scale(16, 4, 1);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.summerTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(0, 0, 0, 1);
	componentAppearance.setDiffuse(0, 0, 0, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.trunk.setSandT(1, 4);
	this.trunk.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI, 0, 0, 1);
	this.scene.rotate(-Math.PI / 20, 1, 0, 0);	
	this.scene.translate(-50, -20, -12);
	this.scene.scale(100, 120, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.beachTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.beach.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI, 0, 0, 1);
	this.scene.translate(-10, -18, -0.1);
	this.scene.scale(36, 20, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.towelTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.towel.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI / 2, 0, 1, 0);
	this.scene.rotate(-Math.PI, 0, 0, 1);
	this.scene.translate(-8, 23, 16);
	this.scene.scale(3, 3, 3);
	this.scene.rotate(-Math.PI / 4, 1, 0, 0);	
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.ballTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.ball.display();
	this.scene.popMatrix();			
}
