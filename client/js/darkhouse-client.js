/**
 * Client game logic for DARKHOUSE
 * Make sure to include JQuery and Socket.io before including this file
 */
(function() {
	var socket = io.connect();

	// Namespaces
	var ROOM_STATE = {
		userIsHost: false,
	};

	// Check if URL has gameID
	ROOM_STATE.gameID = window.location.pathname.substring(1);
	if (ROOM_STATE.gameID) {
		socket.emit('join_game', { gameID: ROOM_STATE.gameID });
	} else ROOM_STATE.gameID = undefined;

	// ----- User Interaction Events -----

	// Create Game button
	$('#create-game').click(function() {
		socket.emit('create_game');
	});

	// Join Game button
	$('#join-game').click(function() {
		socket.emit('join_game', { gameID: '123456' });
	});

	// Start Game button
	$('#room-start-button').click(function() {
		socket.emit('start_game', { gameID: ROOM_STATE.gameID });
	});

	// ----- Communications from Server -----

	// Game created by user
	socket.on('game_created', function(data) {
		transitionToRoom(data.gameID);
		ROOM_STATE.players = [];
		ROOM_STATE.userIsHost = true;
		configureRoomForPlayers();
	});

	// The user successfully joined a room
	socket.on('game_joined', function(data) {
		console.log('data: ' + JSON.stringify(data, null, 3));
		transitionToRoom(data.gameID);
		ROOM_STATE.players = data.players;
		configureRoomForPlayers();
	});

	// Another player joined the room
	socket.on('player_joined_room', function(data) {
		if (data.gameID != ROOM_STATE.gameID) {
			console.error('received player_joined_room for gameID ' + data.gameID + ', not ' + ROOM_STATE.gameID);
			return;
		}

		ROOM_STATE.players.push(data.socketID);
		configureRoomForPlayers();

		if (ROOM_STATE.players.length == 4) {
			//Start Game!
			showStartGameButtonIfHost();
		}
	});

	// Game started
	socket.on('start_game', function() {
		startGame();
	});

	// Failed to join room
	socket.on('game_not_found', function(data) {
		alert('Room ' + data.gameID + ' doesn\'t exist!');
	});

	// ----- UI changes -----
	function transitionToRoom(gameID) {
		$('#main-menu-container').addClass('invisible');
		$('#room-lobby-container').removeClass('invisible');
		$('#room-title').text('Room ' + gameID);
		ROOM_STATE.gameID = gameID;
	}

	function configureRoomForPlayers() {
		var players = ROOM_STATE.players;
		if (players.length == 0) {
			$('#room-person-count').text('1 person in this room');
		} else {
			$('#room-person-count').text((players.length + 1) + ' people in this room');
		}

		$('#room-usernames').html('You<br>');
		players.forEach(function(player) {
			$('#room-usernames').append('Player ' + player + '<br>');
		});
	}

	function showStartGameButtonIfHost() {
		if (ROOM_STATE.userIsHost) {
			$('#room-start-button').removeClass('invisible');
		}
	}

	function startGame() {
		$('#room-lobby-container').addClass('invisible');
		$('#game-container').removeClass('invisible');	
	}
})();