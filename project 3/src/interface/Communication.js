Game.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {

 	var requestPort = port || 8081
 	var request = new XMLHttpRequest();
 	var board = this.board;
	var game = this;
	var linear = this.linear;

 	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

 	request.onload = onSuccess || 
 	function (data) {
 		var response = data.target.response;
		
		if (requestString == "start") {
			console.log("'start'. Reply: " + response);
			
			board.create(response);
		} else if (requestString.includes("validatePieceSelection")) {
			console.log("'validatePieceSelection'. Reply: " + response);
			
			if (response == "true") {
				var x = requestString.charAt(173) - 1;
				var y = requestString.charAt(171) - 1;
				
				board.selectedCell = board.cells[x][y];
				board.getPossibleMoves();
			}
		} else if (requestString.includes("validateDestinySelection")) {
			console.log("'validateDestinySelection'. Reply: " + response);
			if (response == "true") {
				var x = requestString.charAt(179) - 1;
				var y = requestString.charAt(175) - 1;
				
				board.destinationCell = board.cells[x][y];
			}
		} else if (requestString.includes("movePiece")) {
			console.log("'movePiece'. Reply: " + response);
			
			board.recreate(response);
			
			if (game.activeGameMode == 2)
				game.botPlaying = true;
		} else if (requestString.includes("botSelection")) {
			console.log("'botSelection'. Reply: " + response);
			
			game.botSelectedLine = response.charAt(0);
			game.botSelectedColumn = response.charAt(2);
			
			game.botPlay("pieceDestination");
		} else if (requestString.includes("botDestination")) {
			console.log("'botDestination'. Reply: " + response);
			
			game.botDestinationLine = response.charAt(0);
			game.botDestinationColumn = response.charAt(2);
			
			if (game.activeGameMode != 1)
				game.botPlay("botMovePiece");
		} else if (requestString.includes("moveBot")) {
			console.log("'moveBot'. Reply: " + response);
			
			response = board.rotatePrologBoard(response);
			
			board.recreate(response);

			game.botPlaying = false;
			game.setCountdown();
		} else if (requestString.includes("secondSelection")) {
			console.log("'secondSelection'. Reply: " + response);

			game.botSelectedLine = response.charAt(0);
			game.botSelectedColumn = response.charAt(2);

			game.botPlay("pieceDestination");
		} else if (requestString.includes("secondDestination")) {
			console.log("'secondDestination'. Reply: " + response);
			
			game.botDestinationLine = response.charAt(0);
			game.botDestinationColumn = response.charAt(2);
			
			if (game.activeGameMode != 1)
				game.botPlay("botMovePiece");
		} 
 	};

 	request.onerror = onError || function() { console.log("error"); };

 	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
 	request.send();
}

Game.prototype.randomizeMove = function() {
	var randomLine = Math.floor((Math.random() * 8) + 1);
	var randomColumn = Math.floor((Math.random() * 8) + 1);
	
	
}