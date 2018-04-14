
function Game(myInterface) {
    CGFscene.call(this);
    this.texture = null;
   	this.appearance = null;
   	this.surfaces = [];
   	this.translations = [];
	
	this.interface = myInterface;
}

Game.prototype = Object.create(CGFscene.prototype);
Game.prototype.constructor = Game;

Game.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.initCameras();

    this.enableTextures(true);

    this.initLights();

    this.gl.clearColor(0,0,0, 1.0);
    this.gl.clearDepth(10000.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
	this.axis=new CGFaxis(this);

	// INITIALIZE BOARD AND BACKGROUNDS
	this.board = new Board(this);
	this.timer = new Timer(this);
	this.room = new Room(this);
	this.casino = new Casino(this);
	this.beach = new Beach(this);
	
	// LOAD TEXTURES
	this.timerTex = new CGFappearance(this);
	this.timerTex.setAmbient(1, 1, 1, 1);
	this.timerTex.loadTexture('textures/timerTexture.jpg');
	
	this.rouleteTex = new CGFappearance(this);
	this.rouleteTex.setAmbient(1, 1, 1, 1);
	this.rouleteTex.loadTexture('textures/rouletteTexture.jpg');	

	this.woodTex = new CGFappearance(this);
	this.woodTex.setAmbient(1, 1, 1, 1);
	this.woodTex.loadTexture('textures/woodTexture.jpg');

	this.casinoTex = new CGFappearance(this);
	this.casinoTex.setAmbient(1, 1, 1, 1);
	this.casinoTex.loadTexture('textures/casinoTexture.jpg');

	this.wallpaperTex = new CGFappearance(this);
	this.wallpaperTex.setAmbient(1, 1, 1, 1);
	this.wallpaperTex.loadTexture('textures/wallpaperTexture.jpg');
	
	this.pokerTex = new CGFappearance(this);
	this.pokerTex.setAmbient(1, 1, 1, 1);
	this.pokerTex.loadTexture('textures/pokerTexture.jpg');
	
	this.carpetTex = new CGFappearance(this);
	this.carpetTex.setAmbient(1, 1, 1, 1);
	this.carpetTex.loadTexture('textures/carpetTexture.jpg');

	this.beachTex = new CGFappearance(this);
	this.beachTex.setAmbient(1, 1, 1, 1);
	this.beachTex.loadTexture('textures/beachTexture.jpg');

	this.towelTex = new CGFappearance(this);
	this.towelTex.setAmbient(1, 1, 1, 1);
	this.towelTex.loadTexture('textures/towelTexture.jpg');

	this.ballTex = new CGFappearance(this);
	this.ballTex.setAmbient(1, 1, 1, 1);
	this.ballTex.loadTexture('textures/ballTexture.jpg');

	this.summerTex = new CGFappearance(this);
	this.summerTex.setAmbient(1, 1, 1, 1);
	this.summerTex.loadTexture('textures/summerTexture.jpg');

	// OTHER VARIABLES
	this.activePlayer = 1;
	this.activeBot = 1;
	
	this.activeCamera = "Front";
	this.activeBackground = "Room";
	this.gameMode = "Human vs Human";
	this.botType = "Cell selection";
	this.changedOnce = false;
	this.isPlayingMovie = false;
	
	this.roundsWithoutCapture = 0;
	
	this.getPrologRequest('start');

	this.setPickEnabled(true);
	
	this.startTime = 0
	this.setUpdatePeriod(100 / 6);
	this.lastMoveTime = 0;
	
	this.selectedMoveAnimation;
	this.removedMoveAnimation;
	
	this.backupCoords = [];
	this.selCoords = [];
	this.backupPlays = [];
	this.moviePlays = [];
	this.incounter = 0;
	
	this.activeGameMode = 1;
	this.gameStarted = false;
	this.changingPlayer = false;
	
	/// BOT RELATED VARIABLES //
	this.botSelectedLine;
	this.botSelectedColumn;
	this.botDestinationLine;
	this.botDestinationColumn;	
	this.botPlaying;
	this.botInPlay = false;
	
	////// KING /////////
	this.king = new Obj(this, 'Objects/king.obj');
	////// SOLDIERS /////////
	this.soldier = new Obj(this, 'Objects/soldier.obj');
};

Game.prototype.update = function(currTime) {
    if (this.startTime == 0)
        this.startTime = currTime; // places the starting time the same as the current time

    // elapsed time, in milliseconds, define as the difference between the current time and the starting time
    this.elapsedTime = (currTime - this.startTime) / 1000;

	this.updateViews();
}

Game.prototype.setCountdown = function() {
	this.lastMoveTime = this.elapsedTime;
}

Game.prototype.countdown = function() {
	return 61 - (this.elapsedTime - this.lastMoveTime);
}

Game.prototype.updateViews = function () {
	var speedOne = 0.1;
	var speedTwo = 0.12;
	var speedThree = 0.04;
	var increase = 3;
	
	if (this.activeCamera == "Top") {
		if (this.camera.position[1] < 60)
			this.camera.position[1] += speedOne * increase;
			
		if (this.camera.position[2] > 20)
			this.camera.position[2] -= speedTwo * increase;

		if (this.camera.target[1] > -35)
			this.camera.target[1] -= speedOne * increase;
			
		if (this.camera.target[2] < 0)
			this.camera.target[2] += speedThree * increase;
			
		this.changedOnce = true;
	} else if (this.activeCamera == "Front" && this.changedOnce) {
		if (this.camera.position[1] > 35)
			this.camera.position[1] -= speedOne * increase;
			
		if (this.camera.position[2] < 50)
			this.camera.position[2] += speedTwo * increase;

		if (this.camera.target[1] < -10)
			this.camera.target[1] += speedOne * increase;
			
		if (this.camera.target[2] > -10)
			this.camera.target[2] -= speedThree * increase;
			
		this.changedOnce = true;	
	}
}

Game.prototype.initLights = function () {
	this.lights[0].setPosition(1,1,1,1);
	this.lights[0].setAmbient(0.1,0.1,0.1,1);
	this.lights[0].setDiffuse(0.9,0.9,0.9,1);
	this.lights[0].setSpecular(0,0,0,1);
	this.lights[0].enable();		
	this.lights[0].update();
	
	this.lights[1].setPosition(6,6,6,6);
	this.lights[1].setAmbient(0.3,0.3,0.3,1);
	this.lights[1].setDiffuse(1,1,1,1);
	this.lights[1].setSpecular(0,0,0,1);
	this.lights[1].enable();		
	this.lights[1].update();
};

Game.prototype.initCameras = function () {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(8, 35, 50), vec3.fromValues(8, -10, -10));
};

Game.prototype.startGame = function () {
	this.board = new Board(this);
	this.getPrologRequest('start');
	this.board.boardPrimitive.leftoversOne = [];
	this.board.boardPrimitive.leftoversTwo = [];
	this.activePlayer = 1;
	this.activeBot = 1;
	this.backupPlays = [];
	this.moviePlays = [];
	this.botInPlay = false;
	this.botPlaying = false;
	this.isPlayingMovie = false;
	this.lastMoveTime = this.elapsedTime;
	
	this.board.selectedCell = null;
	this.board.destinationCell = null;
	this.selectedMoveAnimation = undefined;
	this.removedMoveAnimation = undefined;
	
	if (this.gameMode == "Human vs Human")
		this.activeGameMode = 1;
	else if (this.gameMode == "Human vs Bot")
		this.activeGameMode = 2;
	else if (this.gameMode == "Bot vs Bot") {
		this.activeGameMode = 3;
		this.first = true;
	}
	
	this.gameStarted = true;
};

Game.prototype.undo = function() {
	if (this.activeGameMode == 1) {
		if (this.backupPlays.length > 0) {
			this.board.undoAnimation = new CircularAnimation(this, "BoardRotation", 3, 0, 0, 0, 0, 0, 180, -1);
			
			var coords = this.backupCoords[this.backupCoords.length - 1];
			var selcoords = this.selCoords[this.selCoords.length - 1];
			var finalselcoords = [selcoords, [0,0,0]];
			
			this.board.returnAnimation = new RemovedAnimation(this, "id", 300, 5, coords);
			this.board.backAnimation = new LinearAnimation(this, "id", this.board.animationSpeed, finalselcoords);
			
			if (this.activePlayer == 1)
				this.activePlayer = 2;
			else
				this.activePlayer = 1;
		}
	}
}

Game.prototype.playMovie = function() {
	if (!this.isPlayingMovie && this.activeGameMode != 3) {
		this.board = new Board(this);
		this.getPrologRequest('start');
		this.board.boardPrimitive.leftoversOne = [];
		this.board.boardPrimitive.leftoversTwo = [];
		this.activePlayer = 1;
		this.activeBot = 1;
		this.backupPlays = [];
		this.botInPlay = false;
		this.botPlaying = false;
		
		this.board.selectedCell = null;
		this.board.destinationCell = null;
		this.selectedMoveAnimation = undefined;
		this.removedMoveAnimation = undefined;
		
		this.activeGameMode = 3;
		this.isPlayingMovie = true;
		this.moviePlays.reverse();
	} else {
		this.isPlayingMovie = false;
		this.startGame();
	}
}


Game.prototype.botPlay = function(state) {
	if (state == "pieceSelection") {
		this.board.prologBoard = this.board.rotatePrologBoard(this.board.prologBoard);
		
		if (this.activeGameMode == 3 && this.activeBot == 1)
			var botSelectionRequest = "secondSelection(";
		else
			var botSelectionRequest = "botSelection(";
		
		botSelectionRequest += this.board.prologBoard;
		botSelectionRequest += ")";
		
		this.getPrologRequest(botSelectionRequest);
	} else if (state == "pieceDestination") {
	
		if (this.activeGameMode == 3 && this.activeBot == 1)
			var botDestinationRequest = "secondDestination(";
		else
			var botDestinationRequest = "botDestination(";

		botDestinationRequest += this.board.prologBoard;
		botDestinationRequest += ",";	
		botDestinationRequest += this.botSelectedLine;
		botDestinationRequest += ",";
		botDestinationRequest += this.botSelectedColumn;
		botDestinationRequest += ")";		
		
		this.getPrologRequest(botDestinationRequest);		
	} else if (state == "botMovePiece") {
		if (!this.isPlayingMovie) {
			var movePrologRequest = "moveBot(";
			movePrologRequest += this.board.prologBoard;
			movePrologRequest += ","
			movePrologRequest += this.botSelectedLine;
			movePrologRequest += ","
			movePrologRequest += this.botSelectedColumn;
			movePrologRequest += ","
			movePrologRequest += this.botDestinationLine;
			movePrologRequest += ","
			movePrologRequest += this.botDestinationColumn;
			movePrologRequest += ","
			movePrologRequest += this.roundsWithoutCapture;		
			movePrologRequest += ")"
			
			this.board.selectedCell = this.board.cells[this.botSelectedColumn - 1][this.botSelectedLine - 1];
			this.board.destinationCell = this.board.cells[this.botDestinationColumn - 1][this.botDestinationLine - 1];
			
			this.moviePlays.push(new MoviePlay(this.board.selectedCell.x, this.board.selectedCell.y, this.board.destinationCell.x, this.board.destinationCell.y));
			
			this.botInPlay = true;

			this.board.pieceMoveAnimation();
			
			this.board.selectedCell = null;
			
			this.getPrologRequest(movePrologRequest);
		} else {
			if (this.moviePlays.length > 0) {
				var lastMove = this.moviePlays[this.moviePlays.length - 1];
				
				if (this.incounter % 2 == 0) {
					var sx = 9 - lastMove.sx;
					var sy = 9 - lastMove.sy;
					var dx = 9 - lastMove.dx;
					var dy = 9 - lastMove.dy;
				} else {
					var sx = lastMove.sx;
					var sy = lastMove.sy;
					var dx = lastMove.dx;
					var dy = lastMove.dy;					
				}
				
				var movePrologRequest = "moveBot(";
				movePrologRequest += this.board.prologBoard;
				movePrologRequest += ","
				movePrologRequest += sx;
				movePrologRequest += ","
				movePrologRequest += sy;
				movePrologRequest += ","
				movePrologRequest += dx;
				movePrologRequest += ","
				movePrologRequest += dy;
				movePrologRequest += ","
				movePrologRequest += this.roundsWithoutCapture;		
				movePrologRequest += ")"
				
				this.board.selectedCell = this.board.cells[sy - 1][sx - 1];
				this.board.destinationCell = this.board.cells[dy - 1][dx - 1];
				
				this.moviePlays.pop();
				this.incounter++;
				
				console.log(this.board.selectedCell);
				console.log(this.board.destinationCell);
				
				this.botInPlay = true;

				this.board.pieceMoveAnimation();
				
				this.board.selectedCell = null;
				
				this.getPrologRequest(movePrologRequest);
			}
		}
	}
}

Game.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var objId = this.pickResults[i][1];
					
					if (objId > 64)
						objId -= 64;
					
					var cell = this.board.getCell(objId);
					
					if (this.board.selectedCell == null && cell.pieceType != 0) {
						var pickingPrologRequest = "validatePieceSelection(";
						pickingPrologRequest += this.activePlayer;
						pickingPrologRequest += ","
						pickingPrologRequest += this.board.prologBoard;
						pickingPrologRequest += ","
						pickingPrologRequest += cell.x;
						pickingPrologRequest += ","
						pickingPrologRequest += cell.y;
						pickingPrologRequest += ","

						if (cell.pieceType == 3 || cell.pieceType == 4)
							pickingPrologRequest += "true)";
						else
							pickingPrologRequest += "false)";

						this.getPrologRequest(pickingPrologRequest);
						
					} else if (this.board.selectedCell != null) {
						if (this.board.selectedCell == cell) {
							this.board.selectedCell = null;
							this.board.possibleCells = [];
						} else {
							var pickingPrologRequest = "validateDestinySelection(";
							pickingPrologRequest += this.activePlayer;
							pickingPrologRequest += ","
							pickingPrologRequest += this.board.prologBoard;
							pickingPrologRequest += ","
							pickingPrologRequest += this.board.selectedCell.x;
							pickingPrologRequest += ","
							pickingPrologRequest += cell.x;
							pickingPrologRequest += ","
							pickingPrologRequest += this.board.selectedCell.y;
							pickingPrologRequest += ","
							pickingPrologRequest += cell.y;
							pickingPrologRequest += ","

							if (this.board.selectedCell.pieceType == 3 || this.board.selectedCell.pieceType == 4)
								pickingPrologRequest += "true)";
							else
								pickingPrologRequest += "false)";
							
							this.getPrologRequest(pickingPrologRequest);							
						}
					}
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}


Game.prototype.display = function() {
	var winner = this.board.winner();
	
	if (!this.changingPlayer && !this.botPlaying && this.activeGameMode != 3 && winner == 'No')
		this.logPicking();
	
	if (this.botPlaying) {
		if (this.selectedMoveAnimation == undefined && this.removedMoveAnimation == undefined) {
			this.botPlay("pieceSelection");
			this.botPlaying = false;
		}
	}
	
	this.clearPickRegistration();

	// Clear image and depth buffer every time we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	
	// Update all lights used
	this.lights[0].update();

	this.rotate(Math.PI/2.0,1,0,0);
	
	////// USED APPERANCES /////////
	this.blueColor = new CGFappearance(this);
	this.blueColor.setAmbient(0, 0, 1, 1);	
	
	this.redColor = new CGFappearance(this);
	this.redColor.setAmbient(1, 0, 0, 1);
	
	this.greenColor = new CGFappearance(this);
	this.greenColor.setAmbient(0, 1, 0, 1);	
	
	this.whiteColor = new CGFappearance(this);
	this.whiteColor.setAmbient(1, 1, 1, 1);

	this.blackColor = new CGFappearance(this);
	this.blackColor.setAmbient(0, 0, 0, 1);
	
	this.yellowColor = new CGFappearance(this);
	this.yellowColor.setAmbient(1, 1, 0, 1);	

	if (this.gameStarted) {
		this.board.display();
		
		if (!this.isPlayingMovie)
			this.timer.display();
	}
	
	if (this.activeBackground == "Room")
		this.room.display();
	else if (this.activeBackground == "Casino")
		this.casino.display();
	else if (this.activeBackground == "Beach")
		this.beach.display();
}
