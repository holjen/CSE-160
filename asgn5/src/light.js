import * as THREE from 'three';

export function addDirectionalLight(scene) {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

export function addAmbientLight(scene) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
}

export function addHemiLight(scene) {
    const skyColor = 0xffbf47;  // light blue
    const groundColor = 0x7dc2ff;  // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}