var io;

function DarkhouseController(sio) {
	io = sio;
}

//TODO: maintain an object that aliases socket IDs to usernames

DarkhouseController.prototype.onConnection = function(socket) {
	socket.on('create_game', createGame);
	socket.on('join_game', joinGame);
    socket.on('start_game', startGame);
}

function createGame() {
	// Create a unique Socket.IO Room
    var gameID = ( Math.random() * 999999 ) | 0;

    this.emit('game_created', {
    	gameID: gameID,
    });

    // Join this socket Room
    // Rooms are named after their gameID
    this.join(gameID.toString());
}

function joinGame(data) {
	var gameID = data.gameID;

	// See if this game exists
	var room = io.sockets.adapter.rooms[gameID];
    if (room) {
    	// Let other players in room know this player joined
    	data.socketID = this.id;
    	io.to(gameID).emit('player_joined_room', data);

    	this.join(gameID);

    	// Let this player know the room was joined successfully
    	var players = Object.keys(room.sockets);
    	players.splice(players.indexOf(this.id), 1);
    	this.emit('game_joined', {
    		gameID: gameID,
    		players: players,
    	});
    } else {
    	this.emit('game_not_found', {
    		gameID: gameID,
    	});
    }
}

function startGame(data) {
    var gameID = data.gameID;

    // See if this game exists
    var room = io.sockets.adapter.rooms[gameID];
    if (room) {
        // Broadcast that this game has started
        io.to(gameID).emit('start_game');
    } else {
        this.emit('game_not_found', {
            gameID: gameID,
        });
    }
}

module.exports = DarkhouseController;