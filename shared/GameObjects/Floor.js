(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _FloorFactory(THREE) {
		var stoneFloorTexture = isBrowser ? stoneFloorTexture = new THREE.TextureLoader().load("textures/stone.png") : null;
		var material = new THREE.MeshLambertMaterial({ map: stoneFloorTexture });
		var geometry = new THREE.PlaneGeometry(10, 10);
		function Floor(width, height) {
			THREE.Object3D.call(this);
			this.position.set(0, 0, 0);
			for (var i = 0; i < width; i += 10) {
				for (var j = 0; j < height; j+= 10) {
					var temp = new THREE.Mesh(geometry, material);
					temp.position.set(i+5, j+5, 0);
					this.add(temp);
				}
			}
		}
		Floor.prototype = Object.create(THREE.Object3D.prototype);
		return Floor;
	}

	if (isBrowser) {
		window.Floor = _FloorFactory(THREE);
	} else {
		module.exports = _FloorFactory;
	}
})();