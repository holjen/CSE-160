import * as THREE from 'three';
import { scene } from "./initWorld.js";

function drawStarParts(color, geometry, x, y, z, scaleX, scaleY, scaleZ, rot) {
    const material = new THREE.MeshPhongMaterial({ color});
    const star = new THREE.Mesh(geometry, material);
    star.scale.set(scaleX, scaleY, scaleZ);
    star.position.x = x;
    star.position.y = y;
    star.position.z = z;
    star.rotateZ(rot);
    scene.add(star);
}

function draw6Star(color, x, y, z, scaleX, scaleY, scaleZ) {
    const radius = 7;  
    const geometry = new THREE.OctahedronGeometry( radius );
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, 0);
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, Math.PI/2);
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, Math.PI/4);
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, -Math.PI/4);
}

function draw4Star(color, x, y, z, scaleX, scaleY, scaleZ) {
    const radius = 7;  
    const geometry = new THREE.OctahedronGeometry( radius );
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, 0);
    drawStarParts(color, geometry, x,y,z,scaleX* .5,scaleY,scaleZ * .5, Math.PI/2);
}

export function drawStars() {
    var lightYellow = 0xfffb7d;
    var darkYellow = 0xfffa52;
    draw4Star(lightYellow, -8,8,-15,.2,.2,.2);
    draw6Star(darkYellow, 0,8,-25,.3,.3,.3);
}