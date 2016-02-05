function DarkhouseController(io) {
	this.io = io;
}

DarkhouseController.prototype.onConnection = function(socket) {
	socket.on('create_game', function() {
		console.log('create game');
	});
	socket.on('join_game', function() {
		console.log('join game');
	});
}

module.exports = DarkhouseController;