// create scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 1000 );

// create renderer and append to document body
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
$('#game-container').append( renderer.domElement );

// create player and add to scene
var player = new Player();
scene.add(player.squareMesh);

// set camera depth
camera.position.z = 25;

document.addEventListener('keydown', function(event) {
  Key.onKeydown(event);
});

document.addEventListener('keyup', function(event) {
  Key.onKeyup(event);
});

// render loop
var render = function () {
  player.update();
  player.squareMesh.position.add(player.direction);
  requestAnimationFrame( render );
  renderer.render(scene, camera);
};

render();