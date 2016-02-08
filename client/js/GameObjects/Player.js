function Player() {
	// Set the different geometries composing the humanoid
	var head = new THREE.SphereGeometry(4, 16, 16),
		hand = new THREE.SphereGeometry(1, 8, 8),
		foot = new THREE.SphereGeometry(2, 4, 0, 8, Math.PI * 2, 0, Math.PI / 2),
		nose = new THREE.SphereGeometry(0.5, 8, 8);
	// Set the material, the "skin"
	var material = new THREE.MeshLambertMaterial({
		color: 0xf23623,
	});
	// Set the character modelisation object
	this.mesh = new THREE.Object3D();
	this.mesh.position.z = 6;
	// Set and add its head
	this.head = new THREE.Mesh(head, material);
	this.head.position.z = 0;
	this.mesh.add(this.head);
	// Set and add its hands
	this.hands = {
		left: new THREE.Mesh(hand, material),
		right: new THREE.Mesh(hand, material)
	};
	this.hands.left.position.x = -5;
	this.hands.left.position.z = -1;
	this.hands.right.position.x = 5;
	this.hands.right.position.z = -1;
	this.mesh.add(this.hands.left);
	this.mesh.add(this.hands.right);
	// Set and add its feet
	this.feet = {
		left: new THREE.Mesh(foot, material),
		right: new THREE.Mesh(foot, material)
	};
	this.feet.left.position.x = -2.5;
	this.feet.left.position.z = -6;
	this.feet.left.rotation.z = Math.PI / 4;
	this.feet.right.position.x = 2.5;
	this.feet.right.position.z = -6;
	this.feet.right.rotation.z = Math.PI / 4;
	this.mesh.add(this.feet.left);
	this.mesh.add(this.feet.right);
	// Set and add its nose
	this.nose = new THREE.Mesh(nose, material);
	this.nose.position.z = 0;
	this.nose.position.y = 4;
	this.mesh.add(this.nose);
	// Set the vector of the current motion
	this.direction = new THREE.Vector3(0, 0, 0);
	// Set the current animation step
	this.step = 0;
	// Set the rays : one vector for every potential direction
	this.rays = [
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(1, -1, 0),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(-1, -1, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(-1, 1, 0)
	];
	// And the "RayCaster", able to test for intersections
	this.caster = new THREE.Raycaster();

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