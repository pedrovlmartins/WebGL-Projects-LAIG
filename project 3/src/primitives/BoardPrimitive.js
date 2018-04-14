function BoardPrimitive(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	this.leftoversOne = [];
	this.leftoversTwo = [];
};

BoardPrimitive.prototype = Object.create(CGFobject.prototype);
BoardPrimitive.prototype.constructor = BoardPrimitive;

BoardPrimitive.prototype.normalizedColumn = function(type) {
	if (type == 1) {
		if (this.leftoversOne.length < 9)
			return 0;
		else if (this.leftoversOne.length < 18)
			return 1;
		else if (this.leftoversOne.length < 27)
			return 2;
		else
			return 3;
	} else {
		if (this.leftoversTwo.length < 9)
			return 0;
		else if (this.leftoversTwo.length < 18)
			return 1;
		else if (this.leftoversTwo.length < 27)
			return 2;
		else
			return 3;		
	}
}

BoardPrimitive.prototype.normalizedLine = function(type) {
	if (type == 1) {
		if (this.leftoversOne.length < 9)
			return this.leftoversOne.length;
		else if (this.leftoversOne.length < 18)
			return this.leftoversOne.length - 9;
		else if (this.leftoversOne.length < 27)
			return this.leftoversOne.length - 18;
		else
			return this.leftoversOne.length - 27;
	} else {
		if (this.leftoversTwo.length < 9)
			return this.leftoversTwo.length;
		else if (this.leftoversTwo.length < 18)
			return this.leftoversTwo.length - 9;
		else if (this.leftoversTwo.length < 27)
			return this.leftoversTwo.length - 18;
		else
			return this.leftoversTwo.length - 27;		
	}
}

BoardPrimitive.prototype.displayCells = function() {
	var counter = 0;
	
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			this.scene.pushMatrix();
		
			this.scene.scale(2, 2, 2);
			this.scene.rotate(- Math.PI / 2, 1, 0, 0);
			this.scene.translate(0.5 + i, 0, 0.5 + j);
			this.scene.registerForPick(counter + 1, this.scene.board.cells[i][j]);
			counter++;
			
			if (i % 2 == 0)
				if (j % 2 == 0)
					this.scene.whiteColor.apply();
				else
					this.scene.blackColor.apply();				
			else
				if (j % 2 == 0)
					this.scene.blackColor.apply();		
				else
					this.scene.whiteColor.apply();			
			
			if (this.scene.board.possibleCells != null)
				if (this.scene.board.possibleCells.includes(this.scene.board.cells[i][j]))
					this.scene.greenColor.apply();
			
			this.scene.board.cells[i][j].plane.display();
			
			this.scene.popMatrix();
		}
	}		
}

BoardPrimitive.prototype.displayPieces = function() {
	var counter = 64;
	
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var cell = this.scene.board.cells[i][j];
			
			if (cell.pieceType == 3 || cell.pieceType == 4) {
				this.scene.pushMatrix();

				this.scene.rotate(- Math.PI , 1, 0, 0);
				this.scene.translate(0.5 + 2 * i, - 2 * (j+1), 0);
				this.scene.scale(0.05, 0.05, 0.05);
				
				this.scene.registerForPick(counter + 1, this.scene.king);
				counter++;	

				if (this.scene.board.selectedCell == this.scene.board.cells[i][j])
					this.scene.greenColor.apply();
				else if (cell.pieceType == 4)
					this.scene.redColor.apply();
				else
					this.scene.blueColor.apply();

				if (this.scene.board.pieceBeingMovedX == cell.x && this.scene.board.pieceBeingMovedY == cell.y) {
					this.scene.selectedMoveAnimation.animate(this.scene.elapsedTime);
					this.scene.rotate(this.scene.board.pieceBeingMovedAngle, 0, 1, 0);		
				}
				
				if (this.scene.board.pieceBeingRemovedX == cell.x && this.scene.board.pieceBeingRemovedX == cell.y)
					this.scene.removedMoveAnimation.animate(this.scene.elapsedTime);	

				this.scene.king.display();	
				this.scene.popMatrix();				
			} else if (cell.pieceType == 1 || cell.pieceType == 2) {
				this.scene.pushMatrix();

				this.scene.rotate(- Math.PI , 1, 0, 0);
				this.scene.translate(0.5, -2 * j - 2, 0);
				this.scene.scale(0.05, 0.05, 0.05);

				this.scene.registerForPick(counter + 1, this.scene.soldier);
				counter++;	

				if (this.scene.board.selectedCell == this.scene.board.cells[i][j])
					this.scene.greenColor.apply();
				else if (cell.pieceType == 2)
					this.scene.redColor.apply();
				else
					this.scene.blueColor.apply();
				
				if (this.scene.board.pieceBeingMovedX == cell.x && this.scene.board.pieceBeingMovedY == cell.y) {
					this.scene.selectedMoveAnimation.animate(this.scene.elapsedTime);
					this.scene.rotate(this.scene.board.pieceBeingMovedAngle, 0, 1, 0);		
				}

				if (this.scene.removedMoveAnimation != undefined)
					if (!this.scene.removedMoveAnimation.ended)
						if (this.scene.board.pieceBeingRemovedX == cell.x && this.scene.board.pieceBeingRemovedY == cell.y) {
							this.scene.removedMoveAnimation.animate(this.scene.elapsedTime);
							this.scene.rotate(0, 0, 1, 0);		
					}
				

				this.scene.translate(i * 40, 0, 0);
				this.scene.soldier.display();
					
				this.scene.popMatrix();			
			} else {				
				counter++;
			}
		}
	}
}

BoardPrimitive.prototype.displayLeftoversOne = function() {
	for (var i = 0; i < this.leftoversOne.length; i++) {
		if (i < 9) {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(-5, -15 + 1.5 * i, 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.blueColor.apply();
			this.scene.soldier.display();		
			this.scene.popMatrix();	
		} else if (i < 18){
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(-5 - 1.5, -15 + 1.5 * (i-9), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.blueColor.apply();		
			this.scene.soldier.display();			
			this.scene.popMatrix();			
		} else if (i < 27) {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(-5 - 3, -15 + 1.5 * (i-18), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.blueColor.apply();		
			this.scene.soldier.display();			
			this.scene.popMatrix();		
		} else {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(-5 - 4.5, -15 + 1.5 * (i-27), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.blueColor.apply();		
			this.scene.soldier.display();			
			this.scene.popMatrix();		
		}
	}
}

BoardPrimitive.prototype.displayLeftoversTwo = function() {
	for (var i = 0; i < this.leftoversTwo.length; i++) {
		if (i < 9) {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(20, -15 + 1.5 * i, 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.redColor.apply();
			this.scene.soldier.display();	
			this.scene.popMatrix();	
		} else if (i < 18) {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(20 + 1.5, -15 + 1.5 * (i-9), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.redColor.apply();	
			this.scene.soldier.display();		
			this.scene.popMatrix();			
		} else if (i < 27) {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(20 + 3, -15 + 1.5 * (i-18), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.redColor.apply();	
			this.scene.soldier.display();		
			this.scene.popMatrix();			
		} else {
			this.scene.pushMatrix();
			this.scene.rotate(- Math.PI , 1, 0, 0);
			this.scene.translate(20 + 4.5, -15 + 1.5 * (i-27), 0);
			this.scene.scale(0.05, 0.05, 0.05);	
			this.scene.redColor.apply();	
			this.scene.soldier.display();		
			this.scene.popMatrix();			
		}
	}
}

BoardPrimitive.prototype.display = function() {
	if (this.startingTime == undefined)
            this.startingTime = this.scene.elapsedTime;

	this.scene.pushMatrix();
	
	this.scene.translate(8, 8, 0);
	
	if (this.scene.board.circular != undefined) {
		this.scene.board.circular.animate(this.scene.elapsedTime);
	}
	
	if (this.scene.board.undoAnimation != undefined) {
		if (this.scene.board.undoAnimation.ended) {
			var reverseBoard = this.scene.board.rotatePrologBoard(this.scene.backupPlays[this.scene.backupPlays.length - 1].backupBoard);
			this.scene.board.create(reverseBoard);
			this.scene.backupPlays.pop();
			this.scene.board.undoAnimation = undefined;
		} else
		this.scene.board.undoAnimation.animate(this.scene.elapsedTime);
	}
		
	this.scene.translate(-8, -8, 0);
	
	if (this.scene.elapsedTime - this.startingTime > 0.2) {
		this.displayCells();
		this.displayPieces();
	}
	
	this.scene.popMatrix();
}