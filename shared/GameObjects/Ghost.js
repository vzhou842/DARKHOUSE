(function() {
	var isBrowser = (typeof window !== 'undefined');

	function _GhostFactory(THREE, Player) {
		//geometries
		var head = new THREE.SphereGeometry(4, 16, 16);

		//materials
		var material = new THREE.MeshLambertMaterial({
			color: 0x999999,
			transparent: true,
			opacity: 0.5,
		});

		function Ghost(x, y, angle) {
			Player.call(this, x, y, angle);

			// Set and add head
			this.head = new THREE.Mesh(head, material);
			this.head.position.z = 0;
			this.add(this.head);

			this.health = 100;
		}

		Ghost.prototype = Object.create(Player.prototype);

		const GHOST_ANIMATE_STEP_SPEED = 10; //per second
		/**
		 * Updates animation step for the ghost if moving.
		 */
		Ghost.prototype.updateAnimationIfNeeded = function(dt) {
			if (this.direction.length() > 0) {
				//TODO: animate ghost
			}
		}

		return Ghost;
	}

	if (isBrowser) {
		window.Ghost = _GhostFactory(THREE, Player);
	} else {
		module.exports = _GhostFactory;
	}
})();