var THREE = require('three');
var Player = require('../shared/GameObjects/Player')(THREE);
var ObstacleBox = require('../shared/GameObjects/ObstacleBox')(THREE);
var Floor = require('../shared/GameObjects/Floor')(THREE);
var io;

function DarkhouseController(sio) {
	io = sio;
}

// This object maintains info about all socket connections.
var sockets = {};

DarkhouseController.prototype.onConnection = function(socket) {
    sockets[socket.id] = {
        username: socket.id,
        gameID: null,
    };
    socket.on('disconnect', disconnect);
	socket.on('create_game', createGame);
	socket.on('join_game', joinGame);
    socket.on('start_game', startGame);
    socket.on('leave_game', leaveGame);
}

function disconnect() {
    // Check if this user was in a room
    if (sockets[this.id].gameID) {
        //notify the room
        io.to(sockets[this.id].gameID).emit('player_disconnected', { socketID: this.id });
    }

    // remove this user from the sockets object
    sockets[this.id] = null;
}

function createGame(data) {
	// Create a unique Socket.IO Room
    var gameID = ( Math.random() * 999999 ) | 0;
    var username = data.username;

    this.emit('game_created', {
    	gameID: gameID,
    });

    // Join this socket Room
    // Rooms are named after their gameID
    this.join(gameID.toString());
    sockets[this.id].gameID = gameID.toString();
    sockets[this.id].username = username;
}

function joinGame(data) {
	var gameID = data.gameID;
    var username = data.username;

    sockets[this.id].username = username;

	// See if this game exists
	var room = io.sockets.adapter.rooms[gameID];
    if (room) {
    	// Let other players in room know this player joined
    	data.username = sockets[this.id].username;
    	io.to(gameID).emit('player_joined_room', data);

    	this.join(gameID);
        sockets[this.id].gameID = gameID;

    	// Let this player know the room was joined successfully
    	var players = Object.keys(room.sockets);
    	players.splice(players.indexOf(this.id), 1);
    	this.emit('game_joined', {
    		gameID: gameID,
    		players: usernamesFromIDs(players),
    	});
    } else {
    	this.emit('game_not_found', {
    		gameID: gameID,
    	});
    }
}

function leaveGame(data) {
    var gameID = data.gameID;

    // See if this user is really in this game
    if (sockets[this.id].gameID == gameID) {
        //Let other players in room know this player left
        data.socketID = this.id;
        io.to(gameID).emit('player_disconnected', data);

        this.leave(gameID);
        sockets[this.id].gameID = null;

        // Let this player know the room was left sucessfully
        this.emit('game_left', { gameID: gameID });
    } else {
        console.error('Received leave_game for game ' + gameID + ' when player is in game ' + sockets[this.id].gameID);
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

// ---------- Helper Functions ----------

function usernamesFromIDs(ids) {
    var usernames = [];
    ids.forEach(function(id) {
        if (sockets[id]) usernames.push(sockets[id].username);
    });
    return usernames;
}

module.exports = DarkhouseController;