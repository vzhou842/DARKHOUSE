(function() {
	var isBrowser = (typeof window !== 'undefined');

	function GameUpdateEvent(players) {
		// IMPORTANT: Maintain order of players array
		this.positions = players.map(function(player) {
			return {
				x: player.position.x,
				y: player.position.y,
				z: player.position.z,
			};
		});
		this.rotations = players.map(function(player) { return player.rotation.z; });
		this.directions = players.map(function(player) {
			return {
				x: player.direction.x,
				y: player.direction.y,
				z: player.direction.z,
			};
		});
		this.flashlights = players.map(function(player) { return player.flashlightOn; });
		this.timestamp = Date.now();
	}

	if (isBrowser) {
		window.GameUpdateEvent = GameUpdateEvent;
	} else {
		module.exports = GameUpdateEvent;
	}
})();