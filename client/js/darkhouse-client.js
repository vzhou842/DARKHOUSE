/**
 * Client game logic for DARKHOUSE
 * Make sure to include JQuery and Socket.io before including this file
 */
var socket = io.connect();

// Check if URL has gameID
var gameID = window.location.pathname.substring(1);
if (gameID) {
	socket.emit('join_game', { gameID: gameID });
}

// ----- User Interaction Events -----

// Create Game button
$('#create-game').click(function() {
	socket.emit('create_game');
});

// Join Game button
$('#join-game').click(function() {
	socket.emit('join_game');
});

// ----- Communications from Server -----

// Game created by user
socket.on('game_created', function(data) {
	transitionToLobby(data.gameID);
});

// User joined game
socket.on('game_joined', function(data) {
	transitionToLobby(data.gameID);
});

// Failed to join room
socket.on('game_not_found', function(data) {
	alert('Room ' + data.gameID + ' doesn\'t exist!');
});

// ----- UI changes -----
function transitionToLobby(gameID) {
	$('#main-menu-container').addClass('invisible');
	$('#room-lobby-container').removeClass('invisible');
	$('#room-title').text('Room ' + gameID);
}