import * as THREE from 'three';
import { scene } from "./initWorld.js";

export function moveClouds(clouds, time) {
    if (!Array.isArray(clouds)) {
        console.error("Expected clouds to be an array, but got:", clouds);
        return;
    }
    clouds.forEach((cloud) => {
        cloud.forEach((cloudPart, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed * .5;
            cloudPart.rotation.y = rot;
            //cloudPart.rotation.y = rot;
            cloudPart.position.y += Math.cos(time) * .02;
            cloudPart.position.x += Math.cos(time) * .08;
        });
    });
}

function drawCloudPart(geometry, x, y, z, scaleX, scaleY, scaleZ) {
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const cloud = new THREE.Mesh(geometry, material);
    cloud.scale.set(scaleX, scaleY, scaleZ);
    cloud.position.y = y;
    cloud.position.x = x;
    cloud.position.z = z;
    scene.add(cloud);
    return cloud;
}

function drawSmallCloud(x, y, z, scaleX, scaleY, scaleZ) {
    const radius = 7;
    const geometry = new THREE.DodecahedronGeometry(radius);
    const cloudParts = [
        drawCloudPart(geometry, x, y, z, scaleX, scaleY, scaleZ),
        drawCloudPart(geometry, x + 3, y - 1.5, z, scaleX, scaleY / 2, scaleZ),
        drawCloudPart(geometry, x - 3, y - 2, z, scaleX, scaleY / 1.5, scaleZ),
    ]
    return cloudParts;
}

export function drawClouds() {
    const clouds = [
        drawSmallCloud(-5, 10, -15, .5, .5, .5)
    ]
    console.log(clouds);
    return clouds;
}