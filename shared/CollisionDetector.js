(function() {
	var isBrowser = (typeof window !== 'undefined');

	var caster = new THREE.Raycaster();
	var rays = [
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(1, -1, 0),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(-1, -1, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(-1, 1, 0)
	];

	// Only 8 valid rays (for the 8 directions)
	/**
	 * Checks for collisions between an object and a set of
	 * obstacles. Returns a direction vector based on the 
	 * object's direction vector that will prevent it from 
	 * colliding with obstacles.
	 * 
	 * @param object A THREE.Object3D with the .collisionDistance property.
	 * @param obstacles An array of THREE.Object3Ds
	 * @return A THREE.Vector3 direction
	 */
	function directionAfterCollisions(object, obstacles) {
		var collisions;
		var direction = object.direction;
		for (var i = 0; i < rays.length; i += 1) {
			caster.set(object.position, rays[i]);
			collisions = caster.intersectObjects(obstacles);

			// Disable velocity in that direction if intersection
			if (collisions.length > 0 && collisions[0].distance <= object.collisionDistance) {
				if ((i === 0 || i === 1 || i === 7) && direction.y === 1) {
					direction.setY(0);
				} else if ((i === 3 || i === 4 || i === 5) && direction.y === -1) {
					direction.setY(0);
				}

                if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
                	direction.setX(0);
                } else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {
                	direction.setX(0);
                }
			}
		}
		return direction;
	}

	if (isBrowser) {
		window.directionAfterCollisions = directionAfterCollisions;
	} else {
		module.exports = {
			directionAfterCollisions: directionAfterCollisions,
		};
	}
})();