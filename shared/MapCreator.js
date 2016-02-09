(function() {
	var isBrowser = (typeof window !== 'undefined');

	var MAP_WIDTH = 280;
	var MAP_HEIGHT = 180;

	function createMapObstacles(Floor, ObstacleBox) {
		var obstacles = [];
		// create the map Floor
		var floor = new Floor(MAP_WIDTH, MAP_HEIGHT);
		obstacles.push(floor);

		// create obstacle boxes
		for (var i = 0; i < MAP_WIDTH; i += 10) {
			obstacles.push(new ObstacleBox(i, 0));
			obstacles.push(new ObstacleBox(i, MAP_HEIGHT-10));
		}
		for (i = 10; i < MAP_HEIGHT - 10; i += 10) {
			obstacles.push(new ObstacleBox(0, i));
			obstacles.push(new ObstacleBox(MAP_WIDTH-10, i));
		}
		obstacles.push(new ObstacleBox(20, 30));
		obstacles.push(new ObstacleBox(30, 20));
		obstacles.push(new ObstacleBox(50, 50));
		obstacles.push(new ObstacleBox(150, 150));
		return obstacles;
	}

	if (isBrowser) {
		window.createMapObstacles = createMapObstacles;
		window.MAP_WIDTH = MAP_WIDTH;
		window.MAP_HEIGHT = MAP_HEIGHT;
	} else {
		module.exports = {
			createMapObstacles: createMapObstacles,
			MAP_WIDTH: MAP_WIDTH,
			MAP_HEIGHT: MAP_HEIGHT,
		};
	}
})();