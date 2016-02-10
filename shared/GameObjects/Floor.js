(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _FloorFactory(THREE) {
			
		var stoneFloorTexture;
		if (isBrowser) {
			stoneFloorTexture = new THREE.TextureLoader().load("textures/stone.png");
			stoneFloorTexture.wrapS = THREE.RepeatWrapping;
			stoneFloorTexture.wrapT = THREE.RepeatWrapping;
		}

		function Floor(width, height) {
			stoneFloorTexture.repeat.set(width/10, height/10);
			var material = new THREE.MeshLambertMaterial({ map: stoneFloorTexture });
			var geometry = new THREE.PlaneGeometry(width, height, width/2, height/2);
			THREE.Mesh.call(this, geometry, material);
			this.position.set(width/2, height/2, 0);
			this.receiveShadow = true;
		}
		Floor.prototype = Object.create(THREE.Mesh.prototype);
		return Floor;
	}

	if (isBrowser) {
		window.Floor = _FloorFactory(THREE);
	} else {
		module.exports = _FloorFactory;
	}
})();