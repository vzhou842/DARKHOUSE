var io;

function DarkhouseController(sio) {
	io = sio;
}

DarkhouseController.prototype.onConnection = function(socket) {
	socket.on('create_game', createGame);
	socket.on('join_game', joinGame);
}

function createGame() {
	// Create a unique Socket.IO Room
    var gameID = ( Math.random() * 999999 ) | 0;

    this.emit('game_created', {
    	gameID: gameID,
    });

    // Join this socket Room
    this.join(gameID.toString());
}

function joinGame(data) {
	var gameID = data.gameID;
	// See if this game exists
    if (io.sockets.adapter.rooms[gameID]) {
    	this.join(gameID);
    	this.emit('game_joined', {
    		gameID: gameID,
    	});
    } else {
    	this.emit('game_not_found', {
    		gameID: gameID,
    	});
    }
}

module.exports = DarkhouseController;