(function() {
	var isBrowser = (typeof window !== 'undefined');

	var MAP_WIDTH = 280;
	var MAP_HEIGHT = 180;

	function createMapObstacles(Floor, ObstacleBox, Wall) {
		var obstacles = [];
		// create the map Floor
		var floor = new Floor(MAP_WIDTH, MAP_HEIGHT);
		obstacles.push(floor);

		// crete walls
		obstacles.push(new Wall(10, MAP_HEIGHT, 0, 0));
		obstacles.push(new Wall(10, MAP_HEIGHT, MAP_WIDTH-10, 0));
		obstacles.push(new Wall(MAP_WIDTH-20, 10, 10, 0));
		obstacles.push(new Wall(MAP_WIDTH-20, 10, 10, MAP_HEIGHT-10));

		// create obstacle boxes
		obstacles.push(new ObstacleBox(1, 20, 30));
		obstacles.push(new ObstacleBox(1, 30, 20));
		obstacles.push(new ObstacleBox(1, 50, 50));
		obstacles.push(new ObstacleBox(1, 150, 150));
		return obstacles;
	}

	function createPlayers(Flashlighter) {
		var players = [];
		players.push(new Flashlighter(15, 15, 0));
		players.push(new Flashlighter(MAP_WIDTH-15, 15, 0));
		players.push(new Flashlighter(MAP_WIDTH-15, MAP_HEIGHT-15, 0));
		players.push(new Flashlighter(15, MAP_HEIGHT-15, 0));
		return players;
	}

	if (isBrowser) {
		window.createMapObstacles = createMapObstacles;
		window.createPlayers = createPlayers;
		window.MAP_WIDTH = MAP_WIDTH;
		window.MAP_HEIGHT = MAP_HEIGHT;
	} else {
		module.exports = {
			createMapObstacles: createMapObstacles,
			createPlayers: createPlayers,
			MAP_WIDTH: MAP_WIDTH,
			MAP_HEIGHT: MAP_HEIGHT,
		};
	}
})();