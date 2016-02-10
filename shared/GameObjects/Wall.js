(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _WallFactory(THREE) {

		var textureLoader = new THREE.TextureLoader();
		var brickTexture = (isBrowser) ? textureLoader.load("textures/brick.png") : null;

		function Wall(width, height, originX, originY) {
			THREE.Object3D.call(this);

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

			var brickRepeatMaterial = new THREE.MeshLambertMaterial({ map: brickTextureRepeat });
			var brickMaterial = new THREE.MeshLambertMaterial({ map: brickTexture });

			var baseMaterials = new THREE.MultiMaterial([brickMaterial, brickMaterial, brickRepeatMaterial, brickRepeatMaterial, brickRepeatMaterial, brickRepeatMaterial]);
	
			this.baseMesh = new THREE.Mesh(baseGeo, baseMaterials);
			this.add(this.baseMesh);

			if (doRotate) {
				var temp = width;
				width = height;
				height = temp;
			}

			this.rotation.z = doRotate ? Math.PI/2 : 0;
			this.position.set(originX + width/2, originY + height/2, 5);
			this.baseMesh.position.set(0, 0, 0);
		}
		Wall.prototype = Object.create(THREE.Object3D.prototype);

		return Wall;
	}

	if (isBrowser) {
		window.Wall = _WallFactory(THREE);
	} else {
		module.exports = _WallFactory;
	}
})();