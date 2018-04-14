function Casino(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.point1 = [0, 0];
	this.point2 = [1, 1];
	this.trunk = new Rectangle(this.scene, this.point1, this.point2);
	this.table = new CylinderTop(this.scene, 30, 30);
	this.table2 = new CylinderTop(this.scene, 30, 30);
	this.smallTable = new Rectangle(this.scene, this.point1, this.point2);
	this.tableSupport = new Obj(this.scene, 'Objects/tableSupport.obj');
	this.wall = new Rectangle(this.scene, this.point1, this.point2);
};

Casino.prototype = Object.create(CGFobject.prototype);
Casino.prototype.constructor = Casino;

Casino.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 6, 1, 0, 0);
	this.scene.rotate(- Math.PI / 2, 1, 0, 0);
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(-16, -6, 0);
	this.scene.scale(16, 4, 1);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.pokerTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.trunk.setSandT(1, 4);
	this.trunk.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-8, 8, -0.1);
	this.scene.scale(0.38, 0.38, 38);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.casinoTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.table.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-8, 8, -0.2);
	this.scene.scale(0.39, 0.39, 39);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.apply();
	this.table.display();
	this.scene.popMatrix();	
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(3.5, 1, -0.2);
	this.scene.scale(6.4, 13.7, 10);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.apply();
	this.smallTable.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(3.6, 1.25, -0.1);
	this.scene.scale(6.1, 13.3, 10);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.casinoTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);	
	componentAppearance.apply();
	this.smallTable.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-26.1, 1, -0.2);
	this.scene.scale(6.6, 13.7, 10);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.apply();
	this.smallTable.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-25.8, 1.25, -0.1);
	this.scene.scale(6.1, 13.3, 10);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.casinoTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.setShininess(true);	
	componentAppearance.apply();
	this.smallTable.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(Math.PI / 2, 0, 0, 1);	
	this.scene.translate(-24, -10, -4.1);
	this.scene.scale(0.25, 0.25, 25);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.timerTex.texture);
	componentAppearance.setAmbient(0, 0, 0, 1);
	componentAppearance.setSpecular(0, 0, 0, 1);
	componentAppearance.setDiffuse(0.6, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.table2.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(Math.PI / 2, 0, 0, 1);
	this.scene.translate(-24, -10, -4.2);
	this.scene.scale(0.26, 0.26, 26);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.apply();
	this.table2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI / 2, 0, 0, 1);	
	this.scene.translate(24, -30, -4.1);
	this.scene.scale(0.25, 0.25, 25);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.rouleteTex.texture);
	componentAppearance.setAmbient(0, 0, 0, 1);
	componentAppearance.setSpecular(0, 0, 0, 1);
	componentAppearance.setDiffuse(0.6, 1, 1, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.table2.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(-Math.PI / 2, 0, 0, 1);
	this.scene.translate(24, -30, -4.2);
	this.scene.scale(0.26, 0.26, 26);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(1, 1, 1, 1);
	componentAppearance.apply();
	this.table2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(Math.PI / 2, 0, 0, 1);
	this.scene.translate(-24, -10, -12);
	this.scene.scale(0.26, 0.26, 0.40);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(0.44, 0.27, 0.07, 1);
	componentAppearance.setSpecular(0.6, 0.6, 0.6, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(false);
	componentAppearance.apply();
	this.tableSupport.display();
	this.scene.translate(0, 155, 0);
	this.tableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.rotate(Math.PI / 2, 0, 0, 1);
	this.scene.translate(8, -7, -12);
	this.scene.scale(0.26, 0.26, 0.65);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.woodTex.texture);
	componentAppearance.setAmbient(0.44, 0.27, 0.07, 1);
	componentAppearance.setSpecular(0.6, 0.6, 0.6, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(false);
	componentAppearance.apply();
	this.tableSupport.display();
	this.scene.translate(0, 115, 0);
	this.tableSupport.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);	
	this.scene.translate(-60, -70, -12);
	this.scene.scale(100, 100, 0);
	var componentAppearance = new CGFappearance(this.scene);
	componentAppearance.setTexture(this.scene.carpetTex.texture);
	componentAppearance.setAmbient(1, 1, 1, 1);
	componentAppearance.setSpecular(1, 1, 1, 1);
	componentAppearance.setDiffuse(0.4, 0.4, 0.4, 1);
	componentAppearance.setShininess(true);
	componentAppearance.apply();
	this.wall.display();
	this.scene.popMatrix();	
}
