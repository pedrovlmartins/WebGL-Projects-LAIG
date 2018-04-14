function MoviePlay(sx, sy, dx, dy) {
	this.sx = sx;
	this.sy = sy;
	this.dx = dx;
	this.dy = dy;
}

MoviePlay.prototype = Object.create(CGFscene.prototype);
MoviePlay.prototype.constructor = MoviePlay;