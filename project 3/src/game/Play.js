function Play(backupBoard, player) {
	this.backupBoard = backupBoard;
	this.player = player;
}

Play.prototype = Object.create(CGFscene.prototype);
Play.prototype.constructor = Play;