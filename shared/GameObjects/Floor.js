(function() {
	var isBrowser = (typeof window !== 'undefined');
	function _FloorFactory(THREE) {
		var material = new THREE.LineBasicMaterial( { color: 0x202020, opacity: 0.25 } );

		function Floor(width, height) {
			var geometry = new THREE.Geometry();
			for (var i = 0; i <= width; i += 10) {
				geometry.vertices.push(new THREE.Vector3(i, 0, 0));
				geometry.vertices.push(new THREE.Vector3(i, height, 0));
			}
			for (var i = 0; i <= height; i += 10) {
				geometry.vertices.push(new THREE.Vector3(0, i, 0));
				geometry.vertices.push(new THREE.Vector3(width, i, 0));
			}

			THREE.LineSegments.call(this, geometry, material);
		}
		Floor.prototype = Object.create(THREE.LineSegments.prototype);
		return Floor;
	}

	if (isBrowser) {
		window.Floor = _FloorFactory(THREE);
	} else {
		module.exports = _FloorFactory;
	}
})();