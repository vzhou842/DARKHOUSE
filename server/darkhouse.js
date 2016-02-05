function DarkhouseController(io) {
	this.io = io;
}

DarkhouseController.prototype.onConnection = function(socket) {
	socket.on('create_game', createGame);
	socket.on('join_game', function() {
		console.log('join game');
	});
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

module.exports = DarkhouseController;