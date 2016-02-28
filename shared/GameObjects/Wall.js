(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _WallFactory(THREE) {

		var textureLoader = new THREE.TextureLoader();
		var brickTexture = (isBrowser) ? textureLoader.load("textures/brick.png") : null;

		function Wall(width, height, originX, originY) {
			var doRotate = false;
			if (height > width) {
				var temp = width;
				width = height;
				height = temp;
				doRotate = true;
			}

			var brickTextureRepeat = null;
			if (isBrowser) {
				brickTextureRepeat = textureLoader.load("textures/brick.png");
				brickTextureRepeat.wrapS = brickTextureRepeat.wrapT = THREE.RepeatWrapping;
				brickTextureRepeat.repeat.set(width/10, height/10);
			}

			var baseGeo = new THREE.BoxGeometry(width, height, 10, width/10, height/10, 1);

			var baseMaterials;
			if (isBrowser) {
				var brickRepeatMaterial = new THREE.MeshLambertMaterial({ map: brickTextureRepeat });
				var brickMaterial = new THREE.MeshLambertMaterial({ map: brickTexture });
				baseMaterials = new THREE.MultiMaterial([brickMaterial, brickMaterial, brickRepeatMaterial, brickRepeatMaterial, brickRepeatMaterial, brickRepeatMaterial]);
			}
			if (doRotate) {
				var temp = width;
				width = height;
				height = temp;
			}

			THREE.Mesh.call(this, baseGeo, baseMaterials);
			this.rotation.z = doRotate ? Math.PI/2 : 0;
			this.position.set(originX + width/2, originY + height/2, 5);
			this.castShadow = true;
			this.receiveShadow = true;
			this.collisionWidth = width;
			this.collisionHeight = height;
		}
		Wall.prototype = Object.create(THREE.Mesh.prototype);

		return Wall;
	}

	if (isBrowser) {
		window.Wall = _WallFactory(THREE);
	} else {
		module.exports = _WallFactory;
	}
})();