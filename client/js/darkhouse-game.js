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
$('#game-container').append( renderer.domElement );

// create the map Floor
var MAP_WIDTH = 400;
var MAP_HEIGHT = 300;
var floor = new Floor(MAP_WIDTH, MAP_HEIGHT);

// create player
var player = new Player();

// create obstacle boxes
for (var i = 0; i < MAP_WIDTH; i += 10) {
	new ObstacleBox(i, 0);
	new ObstacleBox(i, MAP_HEIGHT-10);
}
for (i = 10; i < MAP_HEIGHT - 10; i += 10) {
	new ObstacleBox(0, i);
	new ObstacleBox(MAP_WIDTH-10, i);
}

// Create light
var ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 8, 200);
pointLight.position.set(MAP_WIDTH/2, MAP_HEIGHT/2, 20);
scene.add(pointLight);

camera.position.set(MAP_WIDTH/2, MAP_HEIGHT/2 - 50, 250);
camera.lookAt(new THREE.Vector3(MAP_WIDTH/2, MAP_HEIGHT/2, 0));


document.addEventListener('keydown', function(event) {
	Key.onKeydown(event);
});

document.addEventListener('keyup', function(event) {
	Key.onKeyup(event);
});

// render loop
var render = function () {
	player.updateDirection();
	player.updatePosition(33);
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

// handle window resizing
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

render();