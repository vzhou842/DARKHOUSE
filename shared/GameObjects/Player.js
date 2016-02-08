(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _PlayerFactory(THREE) {
		//geometries
		var head = new THREE.SphereGeometry(4, 16, 16),
			hand = new THREE.SphereGeometry(1, 8, 8),
			foot = new THREE.SphereGeometry(2, 4, 0, 8, Math.PI * 2, 0, Math.PI / 2),
			nose = new THREE.SphereGeometry(0.5, 8, 8);
		//materials
		var material = new THREE.MeshLambertMaterial({
			color: 0xf23623,
		});
		
		function Player() {
			THREE.Object3D.call(this);
			
			this.position.z = 6;
			// Set and add its head
			this.head = new THREE.Mesh(head, material);
			this.head.position.z = 0;
			this.add(this.head);
			// Set and add its hands
			this.hands = {
				left: new THREE.Mesh(hand, material),
				right: new THREE.Mesh(hand, material)
			};
			this.hands.left.position.x = -5;
			this.hands.left.position.z = -1;
			this.hands.right.position.x = 5;
			this.hands.right.position.z = -1;
			this.add(this.hands.left);
			this.add(this.hands.right);
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
			this.add(this.feet.left);
			this.add(this.feet.right);
			// Set and add its nose
			this.nose = new THREE.Mesh(nose, material);
			this.nose.position.z = 0;
			this.nose.position.y = 4;
			this.add(this.nose);
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
		}

		Player.prototype = Object.create(THREE.Object3D.prototype);

		Player.prototype.updateDirection = function() {
			var x = Key.isDown(Key.LEFT) ? -1 : (Key.isDown(Key.RIGHT) ? 1 : 0);
			var y = Key.isDown(Key.DOWN) ? -1 : (Key.isDown(Key.UP) ? 1 : 0); 
			this.direction.set(x, y, 0);
		}

		const PLAYER_MOVE_SPEED_1 = 16; //left right up down
		const PLAYER_MOVE_SPEED_2 = Math.sqrt(PLAYER_MOVE_SPEED_1*PLAYER_MOVE_SPEED_1/2); //diagonal
		const PLAYER_ROTATE_SPEED = Math.PI; //radians / second
		const PLAYER_ANIMATE_STEP_SPEED = 8; //per second
		/**
		 * @param dt Delta Time in milliseconds
		 */
		Player.prototype.updatePosition = function(dt) {
		    this.checkForCollisions();
		    if (this.direction.x !== 0 || this.direction.y !== 0) {
		    	// --- Rotate ---
		        var angle = -Math.atan2(this.direction.x, this.direction.y),
		            difference = angle - this.rotation.z;
		        // If we're doing more than a 180
		        if (Math.abs(difference) > Math.PI) {
		            if (difference > 0) {
		            	this.rotation.z += 2 * Math.PI;
		            }  else {
		            	this.rotation.z -= 2 * Math.PI;
		            }
		            difference = angle - this.rotation.z;
		        }
		        // Now if we haven't reach our target angle
		        if (difference !== 0) {
		        	var rotationAddition = PLAYER_ROTATE_SPEED * (dt/1000) * (difference > 0 ? 1 : -1);
		        	if (Math.abs(rotationAddition) > Math.abs(difference)) {
		        		this.rotation.z += difference;
		        	} else {
		        		this.rotation.z += rotationAddition;
		        	}
		        }

		    	// --- Move ---
		    	this.position.x += this.direction.x * (dt/1000) * (this.direction.y === 0 ? PLAYER_MOVE_SPEED_1 : PLAYER_MOVE_SPEED_2);
		    	this.position.y += this.direction.y * (dt/1000) * (this.direction.x === 0 ? PLAYER_MOVE_SPEED_1 : PLAYER_MOVE_SPEED_2);

		    	// --- Animate ---
		        this.step += PLAYER_ANIMATE_STEP_SPEED * (dt/1000);
		        this.feet.left.position.setY(Math.sin(this.step) * 2);
		        this.feet.right.position.setY(Math.cos(this.step + (Math.PI / 2)) * 2);
		        this.hands.left.position.setY(Math.cos(this.step + (Math.PI / 2)) * 1);
		        this.hands.right.position.setY(Math.sin(this.step) * 1);
		    }
		}

		// TODO: Update the directions if we intersect with an obstacle
		Player.prototype.checkForCollisions = function() {

		}

		return Player;
	} // end _PlayerFactory function

	if (isBrowser) {
		window.Player = _PlayerFactory(THREE);
	} else {
		module.exports = _PlayerFactory;
	}
})();