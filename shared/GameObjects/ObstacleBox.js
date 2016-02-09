(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _ObstacleBoxFactory(THREE) {

		var obstacleBoxTexture1 = (isBrowser) ? new THREE.TextureLoader().load("textures/crate1.png") : null;
		var obstacleBoxTexture2 = (isBrowser) ? new THREE.TextureLoader().load("textures/crate2.png") : null;
		var obstacleBoxTexture3 = (isBrowser) ? new THREE.TextureLoader().load("textures/crate3.png") : null;
		var obstacleBoxTexture4 = (isBrowser) ? new THREE.TextureLoader().load("textures/crate4.png") : null;
		var obstacleBoxTexture5 = (isBrowser) ? new THREE.TextureLoader().load("textures/crate5.png") : null;

		function randomBoxTexture() {
			var rand = Math.random();
			if (rand < 0.2) return obstacleBoxTexture1;
			else if (rand < 0.4) return obstacleBoxTexture2;
			else if (rand < 0.6) return obstacleBoxTexture3;
			else if (rand < 0.8) return obstacleBoxTexture4;
			else return obstacleBoxTexture5;
		}

		var boxGeometry = new THREE.BoxGeometry(10, 10, 10);

		function ObstacleBox(originX, originY) {
			var boxMaterial = new THREE.MeshLambertMaterial({
				map: randomBoxTexture(),
				side: THREE.DoubleSide, // Use this if we want double sided texture rendering
			});
			THREE.Mesh.call(this, boxGeometry, boxMaterial);
			this.position.set(originX + 5, originY + 5, 5);
		}
		ObstacleBox.prototype = Object.create(THREE.Mesh.prototype);

		return ObstacleBox;
	}

	if (isBrowser) {
		window.ObstacleBox = _ObstacleBoxFactory(THREE);
	} else {
		module.exports = _ObstacleBoxFactory;
	}
})();