function Timer(scene) {
    CGFobject.call(this, scene);

    this.scene = scene;
	
	this.redText = new Obj(this.scene, 'Objects/redText.obj');
	this.blueText = new Obj(this.scene, 'Objects/blueText.obj');
	this.winnerText = new Obj(this.scene, 'Objects/winnerText.obj');
	
	this.zero = new Obj(this.scene, 'Objects/zero.obj');
	this.one = new Obj(this.scene, 'Objects/one.obj');
	this.two = new Obj(this.scene, 'Objects/two.obj');
	this.three = new Obj(this.scene, 'Objects/three.obj');
	this.four = new Obj(this.scene, 'Objects/four.obj');
	this.five = new Obj(this.scene, 'Objects/five.obj');
	this.six = new Obj(this.scene, 'Objects/six.obj');
	this.seven = new Obj(this.scene, 'Objects/seven.obj');
	this.eight = new Obj(this.scene, 'Objects/eight.obj');
	this.nine = new Obj(this.scene, 'Objects/nine.obj');
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.display = function() {
	var gameOver = this.scene.board.winner();
	
	if (gameOver == "No") {
		this.scene.pushMatrix();
		this.scene.scale(0.05, 0.05, 0.05);
		this.scene.rotate(-Math.PI / 3, 1, 0, 0);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.scene.translate(41, 90, 0);

		if (this.scene.activeGameMode == 1 && this.scene.activePlayer == 1)
			this.scene.redColor.apply();
		else if (this.scene.activeGameMode == 1)
			this.scene.blackColor.apply();
		else
			this.scene.redColor.apply();

		this.redText.display();
		this.scene.popMatrix();
		
		this.scene.pushMatrix();
		this.scene.scale(0.05, 0.05, 0.05);
		this.scene.rotate(-Math.PI / 3, 1, 0, 0);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.scene.translate(218, 78, 0);
		
		if (this.scene.activeGameMode == 1 && this.scene.activePlayer == 2)
			this.scene.blueColor.apply();
		else if (this.scene.activeGameMode == 1)
			this.scene.blackColor.apply();
		else
			this.scene.blueColor.apply();
			
		this.blueText.display();
		this.scene.popMatrix();	
		
		this.displayFirstPieces();
		this.displaySecondPieces();
		this.displayTimer();
	} else if (gameOver != "undefined") {
		this.displayWinner(gameOver);
	}
}

Timer.prototype.displayWinner = function(gameOver) {
	this.scene.pushMatrix();
	
	this.scene.scale(0.05, 0.05, 0.05);
	this.scene.rotate(-Math.PI / 3, 1, 0, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(105, 90, 0);
	this.scene.whiteColor.apply();	
	this.winnerText.display();
	
	if (gameOver == "Blue") {
		this.scene.translate(25, -40, 0);
		this.scene.blueColor.apply();	
		this.blueText.display();
	} else if (gameOver == "Red") {
		this.scene.translate(30, -25, 0);
		this.scene.redColor.apply();	
		this.redText.display();
	}
	
	this.scene.popMatrix();			
}

Timer.prototype.displayFirstPieces = function() {
	this.scene.pushMatrix();
	this.scene.scale(0.03, 0.03, 0.03);
	this.scene.rotate(-Math.PI / 3, 1, 0, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(92, 110, 0);
	this.scene.whiteColor.apply();
	this.displayDigit(1);
	this.scene.translate(20, 0, 0);
	this.displayDigit(2);
	this.scene.popMatrix();		
}

Timer.prototype.displaySecondPieces = function() {
	this.scene.pushMatrix();
	this.scene.scale(0.03, 0.03, 0.03);
	this.scene.rotate(-Math.PI / 3, 1, 0, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(400, 110, 0);
	this.scene.whiteColor.apply();
	this.displayDigit(3);
	this.scene.translate(20, 0, 0);
	this.displayDigit(4);
	this.scene.popMatrix();		
}

Timer.prototype.displayTimer = function() {
	this.scene.pushMatrix();
	this.scene.scale(0.05, 0.05, 0.05);
	this.scene.rotate(-Math.PI / 3, 1, 0, 0);
	this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate(135, 85, 0);
	this.scene.whiteColor.apply();
	this.displayDigit(5);
	this.scene.translate(25, 0, 0);
	this.displayDigit(6);
	this.scene.popMatrix();		
}

Timer.prototype.displayDigit = function(number) {
	if (number == 1)
		this.getObject(31 - this.scene.board.boardPrimitive.leftoversTwo.length, 1).display();
	else if (number == 2)
		this.getObject(31 - this.scene.board.boardPrimitive.leftoversTwo.length, 2).display();
	else if (number == 3)
		this.getObject(31 - this.scene.board.boardPrimitive.leftoversOne.length, 1).display();
	else if (number == 4)
		this.getObject(31 - this.scene.board.boardPrimitive.leftoversOne.length, 2).display();
	else if (number == 5) {
		if (this.scene.isPlayingMovie)
			this.six.display();
		else if (this.scene.countdown() > 0)
			this.getObject(Math.trunc(this.scene.countdown()), 1).display();
		else
			this.zero.display();
	}
	else if (number == 6) {
		if (this.scene.isPlayingMovie)
			this.zero.display();
		else if (this.scene.countdown() > 0)
			this.getObject(Math.trunc(this.scene.countdown()), 2).display();
		else
			this.zero.display();
	}
}

Timer.prototype.getObject = function(digit, type) {
	var string = digit.toString();
	
	if (string.length == 2 && type == 1)
		string = string.charAt(0);
	else if (string.length == 2 && type == 2)
		string = string.charAt(1);
	else if (string.length == 1 && type == 1)
		return this.zero;
	
	switch (string) {
		case "0": return this.zero; break;
		case "1": return this.one; break;
		case "2": return this.two; break;
		case "3": return this.three; break;
		case "4": return this.four; break;
		case "5": return this.five; break;
		case "6": return this.six; break;
		case "7": return this.seven; break;
		case "8": return this.eight; break;
		case "9": return this.nine; break;
	}
}
