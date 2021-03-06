(function() {
	var isBrowser = (typeof window !== 'undefined');
	//TODO: performance optimization -- merge geometries. http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
	function _ObstacleBoxFactory(THREE) {

		var textureLoader = new THREE.TextureLoader();
		var obstacleBoxTexture1 = (isBrowser) ? textureLoader.load("textures/crate1.png") : null;
		var obstacleBoxTexture2 = (isBrowser) ? textureLoader.load("textures/crate2.png") : null;
		var obstacleBoxTexture3 = (isBrowser) ? textureLoader.load("textures/crate3.png") : null;
		var obstacleBoxTexture4 = (isBrowser) ? textureLoader.load("textures/crate4.png") : null;
		var obstacleBoxTexture5 = (isBrowser) ? textureLoader.load("textures/crate5.png") : null;

		function getTexture(type) {
			if (type == 1) return obstacleBoxTexture1;
			else if (type == 2) return obstacleBoxTexture2;
			else if (type == 3) return obstacleBoxTexture3;
			else if (type == 4) return obstacleBoxTexture4;
			else return obstacleBoxTexture5;
		}
		const size = 10;
		var boxGeometry = new THREE.BoxGeometry(size, size, size);

		function ObstacleBox(type, originX, originY) {
			var boxMaterial = new THREE.MeshLambertMaterial({
				map: getTexture(type),
			});
			THREE.Mesh.call(this, boxGeometry, boxMaterial);
			this.position.set(originX + 5, originY + 5, 5);
			this.castShadow = true;
			this.receiveShadow = true;
			this.collisionWidth = size;
			this.collisionHeight = size;
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