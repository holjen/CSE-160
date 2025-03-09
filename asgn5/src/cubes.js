import * as THREE from 'three';
import { scene } from "./initWorld.js";
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
}

export function spinCubes(cubes, time) {
    if (!Array.isArray(cubes)) {
        console.error("Expected cubes to be an array, but got:", cubes);
        return;
    }
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });
}

export function loadCubes() {
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];
    return cubes;
}