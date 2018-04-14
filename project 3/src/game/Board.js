function Board(scene) {
	this.scene = scene;
	
	this.cells = new Array(8);	
	
	for (var i = 0; i < 8; i++) {
		this.cells[i] = new Array(8);
	}
	
	this.newCells;

	this.cellsCreated = false;
	
	this.selectedCell = null;
	this.destinationCell = null;
	this.possibleCells = [];
	
	this.prologBoard = "";
	
	this.pieceBeingMovedX = null;
	this.pieceBeingMovedY = null;
	this.pieceBeingRemovedX = null;
	this.pieceBeingRemovedY = null;
	this.pieceBeingMovedAngle = null;
	
	this.animationSpeed = 60;

	this.circular = new CircularAnimation(this.scene, "BoardRotation", 10000000, 0, 0, 0, 0, 0, 180, 1);
	this.undoAnimation = undefined;
	this.botBotOne = true;

	this.boardPrimitive = new BoardPrimitive(this.scene);
}

Board.prototype = Object.create(CGFscene.prototype);
Board.prototype.constructor = Board;

Board.prototype.create = function(prologBoard) {	
	this.prologBoard = prologBoard;
	
	this.prologBoard = this.rotatePrologBoard(this.prologBoard);
		
	prologBoard = this.prologBoard;

	prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");
	
	var counter = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {	
			var x = i + 1;
			var y = j + 1;
			var pieceType = prologBoard.charAt(counter);
					
			this.cells[j][i] = new Cell(new CGFplane(this.scene), x, y, pieceType);
			
			counter++;
		}
	}
	
	counter = 0;
	
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {		
			this.cells[i][j].num = counter + 1;
			counter++;
		}
	}
	
	this.cellsCreated = true;
}

Board.prototype.recreate = function(prologBoard) {
	this.newCells = new Array(8);	
	
	for (var i = 0; i < 8; i++) {
		this.newCells[i] = new Array(8);
	}

	this.prologBoard = prologBoard;
	
	if (this.scene.activeGameMode == 1)
		this.prologBoard = this.rotatePrologBoard(this.prologBoard);
	
	prologBoard = this.prologBoard;
	
	prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");
	
	var counter = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {	
			var x = i + 1;
			var y = j + 1;
			var pieceType = prologBoard.charAt(counter);
					
			this.newCells[j][i] = new Cell(new CGFplane(this.scene), x, y, pieceType);
			
			counter++;
		}
	}
	
	counter = 0;
	
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {		
			this.newCells[i][j].num = counter + 1;
			counter++;
		}
	}
	
	if (this.scene.activeGameMode == 3)
		this.cellsCreated = true;
}

Board.prototype.rotatePrologBoard = function(prologBoard) {
	var x1 = prologBoard.substring(2, 17).split("").reverse().join("");
	var x2 = prologBoard.substring(20, 35).split("").reverse().join("");
	var x3 = prologBoard.substring(38, 53).split("").reverse().join("");
	var x4 = prologBoard.substring(56, 71).split("").reverse().join("");
	var x5 = prologBoard.substring(74, 89).split("").reverse().join("");
	var x6 = prologBoard.substring(92, 107).split("").reverse().join("");
	var x7 = prologBoard.substring(110, 125).split("").reverse().join("");
	var x8 = prologBoard.substring(128, 143).split("").reverse().join("");
	
	return "[[" + x8 + "],[" + x7 + "],[" + x6 + "],[" + x5 + "],[" + x4 + "],[" + x3 + "],[" + x2 + "],[" + x1 + "]]";
}

Board.prototype.getCell = function(number) {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {		
			if (this.cells[i][j].num == number)
				return this.cells[i][j];
		}
	}
	
	return -1;
}

Board.prototype.display = function() {
	if (this.scene.selectedMoveAnimation == undefined && this.scene.removedMoveAnimation == undefined) {
		if (this.cellsCreated == true)
			this.displayBoard();
		
		if (this.scene.activeGameMode == 3 && this.botBotOne) {
			if (this.cellsCreated == true) {
				this.scene.botPlay("pieceSelection");
				this.botBotOne = false;
			}
		}	
	} else if (this.scene.selectedMoveAnimation.ended && this.scene.removedMoveAnimation.ended) {
		this.cells = this.newCells;
		this.newCells = null;
		
		if (this.scene.activeGameMode == 1)
			this.changePlayers();
		
		this.scene.selectedMoveAnimation = undefined;
		this.scene.removedMoveAnimation = undefined;
		
		if (this.scene.activeGameMode == 3 && !this.botBotOne) {
			this.changeBots();
			this.botBotOne = true;
		}
		
		this.destinationCell = null;
		
		this.pieceBeingMovedX = null;
		this.pieceBeingMovedY = null;
		this.pieceBeingRemovedX = null;
		this.pieceBeingRemovedY = null;
		
		if (this.scene.botInPlay)
			this.scene.botInPlay = false;
		
		this.displayBoard();
	} else if (!this.scene.selectedMoveAnimation.ended || !this.scene.removedMoveAnimation.ended) {
		if (this.scene.removedMoveAnimation != undefined)
			if (this.scene.removedMoveAnimation.ended)
				this.destinationCell.pieceType = 0;
		
		if (this.cellsCreated == true)
			this.displayBoard();
	}
	
	if (this.selectedCell != null && this.destinationCell != null) {
		if (!this.scene.botInPlay) {
			this.scene.backupPlays.push(new Play(this.prologBoard, this.scene.activePlayer));
			this.scene.moviePlays.push(new MoviePlay(this.selectedCell.x, this.selectedCell.y, this.destinationCell.x, this.destinationCell.y));
			
			this.scene.changingPlayer = true;
			
			var movePrologRequest = "movePiece(";
			movePrologRequest += this.prologBoard;
			movePrologRequest += ","
			movePrologRequest += this.selectedCell.x;
			movePrologRequest += ","
			movePrologRequest += this.selectedCell.y;
			movePrologRequest += ","
			movePrologRequest += this.destinationCell.x;
			movePrologRequest += ","
			movePrologRequest += this.destinationCell.y;
			movePrologRequest += ","
			movePrologRequest += this.scene.roundsWithoutCapture;		
			movePrologRequest += ")"
			
			this.scene.getPrologRequest(movePrologRequest);
			
			if (this.destinationCell.pieceType == 0)
				this.scene.roundsWithoutCapture++;
			else if (this.scene.roundsWithoutCapture > 0)
				this.scene.roundsWithoutCapture = 0;
				
			this.pieceMoveAnimation();
			
			this.selectedCell = null;
			this.possibleCells = [];
		}	
	}
}

Board.prototype.pieceMoveAnimation = function() {
	var direction = this.getDirection(this.selectedCell, this.destinationCell);
	var distance = this.selectedCell.distanceBetween(this.destinationCell, direction);
	
	this.pieceBeingMovedX = this.selectedCell.x;
	this.pieceBeingMovedY = this.selectedCell.y;
	this.pieceBeingRemovedX = this.destinationCell.x;
	this.pieceBeingRemovedY = this.destinationCell.y;
	this.pieceBeingRemovedType = this.destinationCell.pieceType;
	
	if ((this.scene.activeGameMode == 2 && this.scene.botInPlay) || this.scene.activeGameMode == 3) {
		this.pieceBeingMovedX = 9 - this.selectedCell.x;
		this.pieceBeingMovedY = 9 - this.selectedCell.y;
		this.pieceBeingRemovedX = 9 - this.destinationCell.x;
		this.pieceBeingRemovedY = 9 - this.destinationCell.y;
		this.pieceBeingRemovedType = this.cells[this.pieceBeingRemovedY - 1][this.pieceBeingRemovedX - 1].pieceType;
	}
	
	if (this.pieceBeingRemovedY > this.pieceBeingMovedY) {
		this.pieceBeingMovedAngle = - Math.PI / 2;
		if (this.pieceBeingRemovedX < this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[40 * distance,40 * distance,0]]);
		else if (this.pieceBeingRemovedX > this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[40 * distance,-40 * distance,0]]);
		else if (this.pieceBeingRemovedX == this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[40 * distance,0,0]]);
	} else if (this.pieceBeingRemovedY < this.pieceBeingMovedY) {
		this.pieceBeingMovedAngle = Math.PI / 2;
		if (this.pieceBeingRemovedX < this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[-40 * distance,40 * distance,0]]);
		else if (this.pieceBeingRemovedX > this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[-40 * distance,-40 * distance,0]]);
		else if (this.pieceBeingRemovedX == this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[-40 * distance,0,0]]);
	} else if (this.pieceBeingRemovedY == this.pieceBeingMovedY) {
		this.pieceBeingMovedAngle = 0;
		if (this.pieceBeingRemovedX < this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[0,40 * distance,0]]);
		else if (this.pieceBeingRemovedX > this.pieceBeingMovedX)
			this.scene.selectedMoveAnimation = new LinearAnimation(this.scene, "id", this.animationSpeed, [[0,0,0],[0,-40 * distance,0]]);
	}
	
	this.pieceYouAreFired();
}

Board.prototype.pieceYouAreFired = function() {
	var dP = 33;
	var dL = 31;
	var dN = 30;
	
	var normalLinesOne = this.boardPrimitive.normalizedLine(1);
	var normalLinesTwo = this.boardPrimitive.normalizedLine(2);
	var normalColumnsOne = this.boardPrimitive.normalizedColumn(1);
	var normalColumnsTwo = this.boardPrimitive.normalizedColumn(2);
	
	var multX;
	
	if (this.pieceBeingRemovedX != 5)
		multX = this.pieceBeingRemovedX - 5;
	else
		multX = 0;
	
	if (this.pieceBeingRemovedType == 2) // red
		this.scene.removedMoveAnimation = new RemovedAnimation(this.scene, "id", 300, 2,
		[[0,0,0],[0,0,40],
			[-111 - 40*(this.pieceBeingRemovedY - 1) - dN * normalColumnsTwo, 138 - dN * normalLinesTwo + dN * multX, 40],
			[-111 - 40*(this.pieceBeingRemovedY - 1) - dN * normalColumnsTwo, 138 - dN * normalLinesTwo + dN * multX, 0]]);
	else // blue
		this.scene.removedMoveAnimation = new RemovedAnimation(this.scene, "id", 300, 1,
		[[0,0,0],[0,0,40],
			[69 + 40*(9 - this.pieceBeingRemovedY) + dL * normalColumnsOne, 138 - dP * normalLinesOne + dP * multX, 40],
			[69 + 40*(9 - this.pieceBeingRemovedY) + dL * normalColumnsOne, 138 - dP * normalLinesOne + dP * multX, 0]]);
			
	if (this.pieceBeingRemovedType == 0)
		this.scene.removedMoveAnimation.ended = true;
}
	
Board.prototype.getPossibleMoves = function() {
	var emptyInBetween;
	
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (this.selectedCell != this.cells[i][j]) {
				if (this.selectedCell.pieceType != this.cells[i][j].pieceType) {
					var direction = this.getDirection(this.selectedCell, this.cells[i][j]);
					
					if (direction != "unreachable")
						emptyInBetween = this.emptyInBetween(this.selectedCell, this.cells[i][j], direction);
					else
						emptyInBetween = false;
					
					if (emptyInBetween == true)
						this.possibleCells.push(this.cells[i][j]);
				}
			}
		}
	}
}

Board.prototype.getDirection = function(cellOne, cellTwo) {
	if (cellOne.x == cellTwo.x)
		return "horizontal";
	else if (cellOne.y == cellTwo.y)
		return "vertical";
	else if (Math.abs(cellOne.x - cellTwo.x) == Math.abs(cellOne.y - cellTwo.y))
		return "diagonal";
	else
		return "unreachable";
}

Board.prototype.emptyInBetween = function(cellOne, cellTwo, direction) {
	if (direction == "vertical") {
		var beginning = cellOne.x - 1;
		var end = cellTwo.x - 1;
		
		if (beginning > end)
			for (var i = end + 1; i < beginning; i++) {
				if (this.cells[cellOne.y - 1][i].pieceType != 0) {
					return false;
				}
			}
		else
			for (var i = beginning + 1; i < end; i++) {
				if (this.cells[cellOne.y - 1][i].pieceType != 0) {
					return false;
				}
			}
		
		return true;
	} else if (direction == "horizontal") {
		var beginning = cellOne.y - 1;
		var end = cellTwo.y - 1;
		
		if (beginning > end)
			for (var i = end + 1; i < beginning; i++) {
				if (this.cells[i][cellOne.x - 1].pieceType != 0) {
					return false;
				}
			}
		else
			for (var i = beginning + 1; i < end; i++) {
				if (this.cells[i][cellOne.x - 1].pieceType != 0) {
					return false;
				}
			}
		
		return true;
	} else if (direction == "diagonal") {
		var beginningX = cellOne.x - 1;
		var beginningY = cellOne.y - 1;
		var endX = cellTwo.x - 1;
		var endY = cellTwo.y - 1;
		
		if (endX < beginningX && endY > beginningY) {		
			for (var i = beginningX - 1, j = beginningY + 1; i > endX; i--, j++) {
				if (this.cells[j][i].pieceType != 0) {
					return false;
				}
			}
		} else if (endX < beginningX && endY < beginningY) {
			for (var i = beginningX - 1, j = beginningY - 1; i > endX; i--, j--) {
				if (this.cells[j][i].pieceType != 0) {
					return false;
				}
			}		
		} else if (endX > beginningX && endY > beginningY) {
			for (var i = beginningX + 1, j = beginningY + 1; i < endX; i++, j++) {
				if (this.cells[j][i].pieceType != 0) {
					return false;
				}
			}
		} else if (endX > beginningX && endY < beginningY) {
			for (var i = beginningX + 1, j = beginningY - 1; i < endX; i++, j--) {
				if (this.cells[j][i].pieceType != 0) {
					return false;
				}
			}
		}
		
		return true;
	}
}

Board.prototype.changePlayers = function() {
	if (this.scene.activePlayer == 1)
		this.scene.activePlayer = 2;
	else
		this.scene.activePlayer = 1;
		
	this.circular = new CircularAnimation(this.scene, "BoardRotation", 3, 0, 0, 0, 0, 0, 180, 1);
}

Board.prototype.changeBots = function() {
	if (this.scene.activeBot == 1)
		this.scene.activeBot = 2;
	else
		this.scene.activeBot = 1;
}

Board.prototype.displayBoard = function() {
	this.boardPrimitive.display();
	this.boardPrimitive.displayLeftoversOne();
	this.boardPrimitive.displayLeftoversTwo();
}