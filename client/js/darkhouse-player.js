function Player() {
  var squareGeometry = new THREE.Geometry(); 
  squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0)); 
  squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0)); 
  squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0)); 
  squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0)); 
  squareGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
  squareGeometry.faces.push(new THREE.Face3(0, 2, 3)); 

  // create white surface material for square
  var squareMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide
  });

  // add material to square + set position
  this.squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
  this.squareMesh.position.set(0.0, 0.0, 0.0);

  // set initial velocities
  this.direction = new THREE.Vector3(0.0, 0.0, 0.0);
}

Player.prototype.changeLeftVelocity = function(status) {
  if (status) this.direction.setX(-0.1);
  else this.direction.setX(0.0);
}

Player.prototype.changeRightVelocity = function(status) {
  if (status) this.direction.setX(0.1);
  else this.direction.setX(0.0);
}

Player.prototype.changeUpVelocity = function(status) {
  if (status) this.direction.setY(0.1);
  else this.direction.setY(0.0);
}

Player.prototype.changeDownVelocity = function(status) {
  if (status) this.direction.setY(-0.1);
  else this.direction.setY(0.0);
}

Player.prototype.update = function() {
  if (Key.isDown(Key.LEFT)) this.changeLeftVelocity(true);
  else if (Key.isDown(Key.RIGHT)) this.changeRightVelocity(true)
  else this.changeLeftVelocity(false);

  if (Key.isDown(Key.UP)) this.changeUpVelocity(true);
  else if (Key.isDown(Key.DOWN)) this.changeDownVelocity(true)
  else this.changeUpVelocity(false);
}