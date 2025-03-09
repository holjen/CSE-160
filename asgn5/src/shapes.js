import * as THREE from 'three';
import { scene } from "./initWorld.js";


export var heightOfTable =1;
var heightOfTableFoot = 3;

export function loadFloor(y) {
    const geometry = new THREE.BoxGeometry(300, 10, 300);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../resources/textures/blue_floor.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
        map: texture,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotateY(Math.PI);
    scene.add(cube);

    cube.position.y = y;
}

function createTableSurface() {
    const radiusTop = 2.0;
    const radiusBottom = 2;
    const height = .2;
    const radialSegments = 31;
    const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshPhongMaterial(0x44aa88);
    const tabletop = new THREE.Mesh(geometry, material);
    tabletop.position.y = heightOfTable;
    scene.add(tabletop);
}

function createTableFoot() {
    const radiusTop = .3;
    const radiusBottom = .3;
    const height = heightOfTableFoot;
    const radialSegments = 31;
    const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshPhongMaterial(0x44aa88);
    const tableFoot = new THREE.Mesh(geometry, material);
    tableFoot.position.y =heightOfTable - heightOfTableFoot/2;
    scene.add(tableFoot);
}
export function createTable() {
    createTableSurface();
    createTableFoot();
}