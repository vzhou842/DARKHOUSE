var THREE = require('three');
var gameloop = require('node-gameloop');

// Game Objects
var Player = require('./shared/GameObjects/Player')(THREE);
var ObstacleBox = require('./shared/GameObjects/ObstacleBox')(THREE);
var Floor = require('./shared/GameObjects/Floor')(THREE);
var Wall = require('./shared/GameObjects/Wall')(THREE);
var MapCreator = require('./shared/MapCreator');

// Events
var InputEventModule = require('./shared/Events/InputEvent');
var InputEvent = InputEventModule.InputEvent,
    InputEventType = InputEventModule.InputEventType;
var GameUpdateEvent = require('./shared/Events/GameUpdateEvent');

var io;

function DarkhouseController(sio) {
	io = sio;
}

// This object contains obstacles for any given map, keyed by map
var obstacles = {
    map1: MapCreator.createMapObstacles(Floor, ObstacleBox, Wall),
}

// This object maintains info about all socket connections.
var sockets = {};

// This object maintains info about all current games
var games = {};

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
    socket.on('client_input', handleClientInput);
    socket.emit('client_connected', { playerID: socket.id });
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
        // Initialize data for the game
        games[gameID] = {};
        games[gameID].obstacles = obstacles.map1;
        games[gameID].players = MapCreator.createPlayers(Player);
        games[gameID].playerIDs = Object.keys(io.sockets.adapter.rooms[gameID].sockets);
        games[gameID].inputBuffer = [];

        // Start the game loop
        games[gameID].gameloopID = gameloop.setGameLoop(gameLoopFactory(gameID), 1000/30);

        // Broadcast that this game has started
        io.to(gameID).emit('start_game');
    } else {
        this.emit('game_not_found', {
            gameID: gameID,
        });
    }
}

// unused right now, to be used in future
function endGame(data) {
    var gameID = data.gameID;

    gameloop.clearGameLoop(games[gameID].gameloopID);
}

function handleClientInput(inputEvent) {
    var playerID = inputEvent.playerID;
    var gameID = sockets[playerID].gameID;
    if (games.hasOwnProperty(gameID)) {
        games[gameID].inputBuffer.push(inputEvent);
    }
}

// ---------- GAME LOOP ----------
function gameLoopFactory(gameID) {
    /// @param dt Time change in seconds
    return function(dt) {
        // Handle all buffered inputs received from clients
        var inputs = games[gameID].inputBuffer.splice(0, games[gameID].inputBuffer.length);
        inputs.forEach(function(inputEvent) {
            handleInputEvent(gameID, inputEvent);
        });

        // Update GameObjects
        games[gameID].players.forEach(function(player) {
            player.updatePosition(dt*1000);
        });

        // Send Game Update to clients
        io.to(gameID).emit('game_update', new GameUpdateEvent(games[gameID].players));
    };
}

function handleInputEvent(gameID, inputEvent) {
    var playerID = inputEvent.playerID;
    var up = inputEvent.up;
    var player = games[gameID].players[games[gameID].playerIDs.indexOf(playerID)];
    switch (inputEvent.type) {
        case InputEventType.LEFT:
            if (up && player.direction.x < 0) player.direction.x = 0;
            else if (!up) player.direction.x = -1;
            break;
        case InputEventType.RIGHT:
            if (up && player.direction.x > 0) player.direction.x = 0;
            else if (!up) player.direction.x = 1;
            break;
        case InputEventType.UP:
            if (up && player.direction.y > 0) player.direction.y = 0;
            else if (!up) player.direction.y = 1;
            break;
        case InputEventType.DOWN:
            if (up && player.direction.y < 0) player.direction.y = 0;
            else if (!up) player.direction.y = -1;
            break;
        case InputEventType.SPACE:
            player.flashlightOn = !up;
            break;
        default:
            console.error('Input event with unknown type ' + inputEvent.type + ' received.');
            break;
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