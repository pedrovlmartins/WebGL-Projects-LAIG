function Cell(plane, x, y, pieceType) {
	this.num;
	this.plane = plane;
	this.x = x;
	this.y = y;
	this.pieceType = pieceType;
}

Cell.prototype = Object.create(CGFscene.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.distanceBetween = function(otherCell, direction) {
	if (direction == "vertical" || direction == "diagonal")
		return Math.abs(otherCell.x - this.x);
	else if (direction == "horizontal")
		return Math.abs(otherCell.y - this.y);
}