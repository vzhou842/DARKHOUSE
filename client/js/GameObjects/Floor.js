function Floor(width, height) {
	var geometry = new THREE.Geometry();
	var step = 10;
	for (var i = 0; i <= width; i += step) {
		geometry.vertices.push(new THREE.Vector3(i, 0, 0));
		geometry.vertices.push(new THREE.Vector3(i, height, 0));
	}
	for (var i = 0; i <= height; i += step) {
		geometry.vertices.push(new THREE.Vector3(0, i, 0));
		geometry.vertices.push(new THREE.Vector3(width, i, 0));
	}

	var material = new THREE.LineBasicMaterial( { color: 0x202020, opacity: 0.25 } );

	this.mesh = new THREE.LineSegments( geometry, material );

	scene.add(this.mesh);
}