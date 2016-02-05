/**
 * Client game logic for DARKHOUSE
 * Make sure to include JQuery and Socket.io before including this file
 */
var socket = io.connect();

$('#create-game').click(function() {
	socket.emit('create_game');
});
$('#join-game').click(function() {
	socket.emit('join_game');
});