(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _ObstacleBoxFactory(THREE) {
		// Load an image as texture 
		var obstacleBoxTexture = (isBrowser) ? new THREE.TextureLoader().load("textures/crate.png") : null;

		var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
		var boxMaterial = new THREE.MeshLambertMaterial({
			map: obstacleBoxTexture,
			side: THREE.DoubleSide, // Use this if we want double sided texture rendering
		});

		function ObstacleBox(originX, originY) {
			this.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
			this.mesh.position.set(originX + 5, originY + 5, 5);
		}
		return ObstacleBox;
	}

	if (isBrowser) {
		window.ObstacleBox = _ObstacleBoxFactory(THREE);
	} else {
		module.exports = _ObstacleBoxFactory;
	}
})();