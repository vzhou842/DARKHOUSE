(function() {
	var isBrowser = (typeof window !== 'undefined');

	function _FlashlighterFactory(THREE, Player) {
		//geometries
		var head = new THREE.SphereGeometry(4, 16, 16),
			hand = new THREE.SphereGeometry(1, 8, 8),
			foot = new THREE.SphereGeometry(2, 4, 0, 8, Math.PI * 2, 0, Math.PI / 2),
			nose = new THREE.SphereGeometry(0.5, 8, 8);
		//materials
		var material = new THREE.MeshLambertMaterial({
			color: 0xf23623,
		});
		
		function Flashlighter(x, y, angle) {
			Player.call(this, x, y, angle);

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
			const flashlightConeLength = 10;

			this.flashlight = new THREE.SpotLight(0xffffff, 0, 50, Math.PI/2, 10, 3);
			this.flashlight.position.set(0, 0, 0);
			this.flashlight.castShadow = true;
			this.flashlight.shadowDarkness = 1;
			this.flashlight.shadowCameraNear = true;

			var flashlightTarget = new THREE.Object3D();
			flashlightTarget.position.set(0, 10, 0);
			this.flashlight.target = flashlightTarget;

			// this.flashlightCone = new THREE.Mesh(
			//     new THREE.CylinderGeometry(5, 1, flashlightConeLength, 12),
			//     new THREE.MeshLambertMaterial({
			//         color: new THREE.Color(0xffff88),
			//         transparent: true,
			//         opacity: 0.3,
			//     }));
			// this.flashlightCone.position.set(0, this.flashlight.position.y + flashlightConeLength/2, 0);
			// this.flashlightCone.visible = false;

			this.add(this.flashlight);
			this.add(this.flashlight.target);
			// this.add(this.flashlightCone);

			this.flashlightOn = false;
		}

		Flashlighter.prototype = Object.create(Player.prototype);

		const MAX_FLASHLIGHT_INTESITY = 40;
		Flashlighter.prototype.setFlashlightOn = function(flashlightOn) {
			if (this.flashlightOn !== flashlightOn) {
				this.flashlight.intensity = flashlightOn ? MAX_FLASHLIGHT_INTESITY : 0;
			}
			this.flashlightOn = flashlightOn;
		}

		const PLAYER_ANIMATE_STEP_SPEED = 10; //per second
		/**
		 * Updates animation step for a player if the player is moving.
		 */
		Flashlighter.prototype.updateAnimationIfNeeded = function(dt) {
			if (this.direction.length() > 0) {
				// --- Animate ---
				this.step += PLAYER_ANIMATE_STEP_SPEED * (dt/1000);
				this.feet.left.position.setY(Math.sin(this.step) * 2);
				this.feet.right.position.setY(Math.cos(this.step + (Math.PI / 2)) * 2);
				this.hands.left.position.setY(Math.cos(this.step + (Math.PI / 2)) * 1);
				this.hands.right.position.setY(Math.sin(this.step) * 1);
			}
		}

		return Flashlighter;
	}

	if (isBrowser) {
		window.Flashlighter = _FlashlighterFactory(THREE, Player);
	} else {
		module.exports = _FlashlighterFactory;
	}
})();