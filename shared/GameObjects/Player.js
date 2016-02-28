(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _PlayerFactory(THREE) {

		// @param angle The angle, in radians ccw from +y axis, that the player is facing. 
		function Player(x, y, angle) {
			THREE.Object3D.call(this);
			
			this.position.set(x, y, 6);
			this.step = 0;
			this.collisionDistance = 4.5;

			this.rotation.z = angle;
			this.direction = new THREE.Vector3(0, 0, 0);

			//server fields
			this.isGoingLeft = false;
			this.isGoingUp = false;
			this.isGoingRight = false;
			this.isGoingDown = false;
		}

		Player.prototype = Object.create(THREE.Object3D.prototype);

		const PLAYER_MOVE_SPEED_1 = 30; //left right up down
		const PLAYER_MOVE_SPEED_2 = Math.sqrt(PLAYER_MOVE_SPEED_1*PLAYER_MOVE_SPEED_1/2); //diagonal
		const PLAYER_ROTATE_SPEED = Math.PI * 1.5; //radians / second
		/**
		 * Updates position and rotation of a player based on their direction and input dt.
		 * @param dt Delta Time in milliseconds
		 */
		Player.prototype.updatePosition = function(dt) {
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
			}
		}

		/**
		 * Should only be called by server.
		 * Updates the player's velocity based on what keys are down in the client.
		 * Used to potentially reset velocity after collisions cease.
		 */
		Player.prototype.serverUpdateVelocity = function() {
			if (this.isGoingLeft) this.direction.x = -1;
			if (this.isGoingUp) this.direction.y = 1;
			if (this.isGoingRight) this.direction.x = 1;
			if (this.isGoingDown) this.direction.y = -1;
		}

		return Player;
	} // end _PlayerFactory function

	if (isBrowser) {
		window.Player = _PlayerFactory(THREE);
	} else {
		module.exports = _PlayerFactory;
	}
})();