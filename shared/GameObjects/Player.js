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

		// @param angle The angle, in radians ccw from +y axis, that the player is facing. 
		function Player(x, y, angle) {
			THREE.Object3D.call(this);
			
			this.position.set(x, y, 6);
			this.step = 0;
			this.collisionDistance = 5;

			// Set and add head
			this.head = new THREE.Mesh(head, material);
			this.head.position.z = 0;
			this.add(this.head);

			// Set and add hands
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

			// Set and add feet
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

			// Set and add nose
			this.nose = new THREE.Mesh(nose, material);
			this.nose.position.z = 0;
			this.nose.position.y = 4;
			this.add(this.nose);

			// Setup the flashlight for the Player
			const flashlightConeLength = 30;
			this.flashlight = new THREE.SpotLight(0xffffff, 0, flashlightConeLength, Math.PI/4, 10, 1.1);
			this.flashlight.position.set(0, this.collisionDistance * .999, 0);
			var flashlightTarget = new THREE.Object3D();
			flashlightTarget.position.set(0, this.collisionDistance * 2, 0);
			this.flashlight.target = flashlightTarget;

			this.flashlightCone = new THREE.Mesh(
			    new THREE.CylinderGeometry(12, 1, flashlightConeLength, 12),
			    new THREE.MeshBasicMaterial({
			        color: new THREE.Color(0xffff88),
			        transparent: true,
			        opacity: 0.1,
			    }));
			this.flashlightCone.position.set(0, this.flashlight.position.y + flashlightConeLength/2, 0);
			this.flashlightCone.visible = false;

			this.add(this.flashlight);
			this.add(this.flashlight.target);
			this.add(this.flashlightCone);

			this.rotation.z = angle;
			this.direction = new THREE.Vector3(0, 0, 0);
		}

		Player.prototype = Object.create(THREE.Object3D.prototype);

		const MAX_FLASHLIGHT_INTESITY = 16;
		Player.prototype.updateForInputs = function() {
			var x = Key.isDown(Key.LEFT) ? -1 : (Key.isDown(Key.RIGHT) ? 1 : 0);
			var y = Key.isDown(Key.DOWN) ? -1 : (Key.isDown(Key.UP) ? 1 : 0); 
			this.direction.set(x, y, 0);

			var flashlightOn = Key.isDown(Key.SPACE) ? true : false;
			if (this.flashlightCone.visible !== flashlightOn) {
				this.flashlight.intensity = flashlightOn ? MAX_FLASHLIGHT_INTESITY : 0;
				this.flashlightCone.visible = flashlightOn;
			}
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