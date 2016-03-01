(function() {
	var isBrowser = (typeof window !== 'undefined');

	function _CollisionDetectorFactory(THREE) {
		/**
		 * Checks for collisions between an object and a set of
		 * obstacles. Changes the object's direction vector to one
		 * that will prevent it from colliding with obstacles.
		 * 
		 * An obstacle without the .collisionWidth and .collisionHeight properties
		 * will be ignored.
		 * 
		 * @param object A THREE.Object3D with the .collisionDistance property.
		 * @param obstacles An array of THREE.Object3Ds
		 */
		function checkForCollisions(object, obstacles) {
			obstacles.forEach(function(obstacle) {
				checkForCollision(object, obstacle);
			});
		}

		const rays = [
			new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(1, 1, 0),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(1, -1, 0),
			new THREE.Vector3(0, -1, 0),
			new THREE.Vector3(-1, -1, 0),
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(-1, 1, 0),
		];
		const FIVE_ROOT_2 = 7.08;

		// Private Helper. Checks for collisions between object and 1 obstacle.
		// Changes object's direction vector on collision.
		function checkForCollision(object, obstacle) {
			var direction = object.direction;

			//loop through 8 directions
			for (var i = 0; i < 8; i++) {
				var result = checkForRayIntersection(object, obstacle, rays[i]);
				if (result && distance2d(result, object.position) <= object.collisionDistance) {
					// Collision! Disable velocity in this direction.
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
			
		}

		// Private Helper. Checks for intersections in a given direction between an object and an obstacle.
		// Returns a THREE.Vector3 for the location of the intersection CLOSEST TO THE OBJECT, or null if none.
		function checkForRayIntersection(object, obstacle, d) {
			var halfWidth = obstacle.collisionWidth/2;
			var halfHeight = obstacle.collisionHeight/2;
			if (!halfWidth || !halfHeight) return null;

			//early return distance check
			if (halfWidth <= 10 && halfHeight <= 10 && distance2d(object.position, obstacle.position) > FIVE_ROOT_2 + object.collisionDistance) {
				return null;
			}

			var r = object.position; //ray start
			var s = new THREE.Vector3();
			var e = new THREE.Vector3();

			//loop through 4 sides
			var result;
			var resultDistance;
			for (var side = 0; side < 4; side++) {
				s.set(obstacle.position.x + (side % 2 == 0 ? -halfWidth : halfWidth),
					obstacle.position.y + (side < 2 ? -halfHeight : halfHeight),
					0);
				e.set(obstacle.position.x + (side < 2 ? halfWidth : -halfWidth),
					obstacle.position.y + (side % 2 == 0 ? -halfHeight : halfHeight),
					0);

				var tempResult = intersectLineSegments(r, d, s, e);
				var tempDistance = Math.Infinity;
				if (tempResult) {
					tempDistance = distance2d(tempResult, object.position);
				}
				if (!result || resultDistance > tempDistance) {
					result = tempResult;
					resultDistance = tempDistance;
				}
			}
			return result;
		}

		/**
		 * Private Helper. Checks for intersections between 1 ray + 1 line segment
		 * All parameters are THREE.Vector3
		 * Does NOT mutate inputs.
		 * @param r Ray Start
		 * @param d Ray Direction
		 * @param s Line Segment Start
		 * @param e Line Segment End
		 * @return a THREE.Vector3 for the intersection, if existent. Otherwise returns null.
		 */
		function intersectLineSegments(r, d, s, e) {
			var u = new THREE.Vector3();
			u.subVectors(e, s);
			var k = new THREE.Vector3();
			k.subVectors(s, r);
			var denom = cross2d(d, u);
			var t1 = cross2d(k, u) / denom;
			var t2 = cross2d(k, d) / denom;
			if (t1 < 0 || t2 < 0 || t2 > 1) {
				return null;
			}
			var ret = new THREE.Vector3();
			u.multiplyScalar(t2);
			ret.addVectors(s, u);
			return ret;
		}

		// Private Helper. Performs a 2D cross product of 2 THREE.Vector3s
		function cross2d(v1, v2) {
			return v1.x * v2.y - v1.y * v2.x;
		}

		// Private Helper. Returns distance ignoring the z component.
		function distance2d(v1, v2) {
			return Math.sqrt((v2.x - v1.x)*(v2.x - v1.x) + (v2.y - v1.y)*(v2.y - v1.y));
		}

		return {
			checkForCollisions: checkForCollisions,
		};
	}

	if (isBrowser) {
		var cd = _CollisionDetectorFactory(THREE);
		window.checkForCollisions = cd.checkForCollisions;
	} else {
		module.exports = _CollisionDetectorFactory;
	}
})();