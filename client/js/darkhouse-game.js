/** GAME NOTES
 * The bottom left corner of the map will always be (0,0,0).
 * Tiles are 10x10, so obstacle boxes for example would be 10x10x10.
 * An object's 'origin' refers to their bottom-left corner.
 */

// Create scene
var scene = new THREE.Scene();

// Create camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 1000 );

// create renderer and append to document body
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('#game-container').append( renderer.domElement );

// create players
var players = createPlayers(Player);
players.forEach(function(player) {
	scene.add(player);
});

// create obstacles
var obstacles = createMapObstacles(Floor, ObstacleBox, Wall);
obstacles.forEach(function(obstacle) {
	scene.add(obstacle);
});

// Create light
var ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

camera.position.set(MAP_WIDTH/2, MAP_HEIGHT/2 - 25, 150);
camera.lookAt(new THREE.Vector3(MAP_WIDTH/2, MAP_HEIGHT/2, 0));


// Server Game Updates
var lastServerUpdate = null;
function handleGameUpdate(gameUpdateEvent) {
	lastServerUpdate = gameUpdateEvent;
}

function extrapolateFromGameUpdate(gameUpdateEvent) {
	// First initialize to the server provided state
	gameUpdateEvent.positions.forEach(function(position, index) {
		players[index].position.set(position.x, position.y, position.z);
	});
	gameUpdateEvent.directions.forEach(function(direction, index) {
		players[index].direction.set(direction.x, direction.y, direction.z);
        //TODO: check for collisions in client side, just not at 60 fps
	});
	gameUpdateEvent.rotations.forEach(function(z, index) {
		players[index].rotation.z = z;
	});
	gameUpdateEvent.flashlights.forEach(function(on, index) {
		players[index].setFlashlightOn(on);
	});

	// Extrapolate
	var dt = Date.now() - gameUpdateEvent.timestamp; //ms since last update
	players.forEach(function(player) {
		player.updatePosition(dt);
	});
}

// render loop
var lastRender = Date.now();
var render = function () {
	if (lastServerUpdate) {
		extrapolateFromGameUpdate(lastServerUpdate);
	}
	players.forEach(function(player) { player.updateAnimationIfNeeded(Date.now() - lastRender); });
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	lastRender = Date.now();
};

// handle window resizing
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

render();