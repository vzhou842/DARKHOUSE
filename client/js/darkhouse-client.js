/**
 * Client game logic for DARKHOUSE
 * Make sure to include JQuery and Socket.io before including this file
 */
var socket = io.connect();

// ----- User Interaction -----

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
	$('#main-menu-container').addClass('invisible');
	$('#room-lobby-container').removeClass('invisible');
	$('#room-title').text('Room ' + data.gameID);
});