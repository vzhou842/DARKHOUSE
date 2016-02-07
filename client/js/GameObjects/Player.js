function Player() {
	var geo = new THREE.BoxGeometry(5, 5, 5);

	// create white surface material
	var squareMaterial = new THREE.MeshLambertMaterial({
		color:0xFFFFFF,
		side:THREE.DoubleSide,
	});

	// add material to square + set position
	this.mesh = new THREE.Mesh(geo, squareMaterial);
	this.mesh.position.set(0.0, 0.0, 0.0);

	// set initial velocity
	this.direction = new THREE.Vector3(0.0, 0.0, 0.0);

	scene.add(this.mesh);
}

Player.prototype.changeLeftVelocity = function(status) {
	if (status) this.direction.setX(-1);
	else this.direction.setX(0.0);
}

Player.prototype.changeRightVelocity = function(status) {
	if (status) this.direction.setX(1);
	else this.direction.setX(0.0);
}

Player.prototype.changeUpVelocity = function(status) {
	if (status) this.direction.setY(1);
	else this.direction.setY(0.0);
}

Player.prototype.changeDownVelocity = function(status) {
	if (status) this.direction.setY(-1);
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