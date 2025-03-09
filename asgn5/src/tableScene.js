import * as THREE from 'three';
import { drawTableObjs } from './tableObjects.js';
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

function createTableSurface(color) {
    const radiusTop = 3.0;
    const radiusBottom = 3;
    const height = .2;
    const radialSegments = 31;
    const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshPhongMaterial({color});
    const tabletop = new THREE.Mesh(geometry, material);
    tabletop.position.y = heightOfTable;
    scene.add(tabletop);
}

function createTableFoot(color) {
    const radiusTop = .4;
    const radiusBottom = .4;
    const height = heightOfTableFoot;
    const radialSegments = 31;
    const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshPhongMaterial({color});
    const tableFoot = new THREE.Mesh(geometry, material);
    tableFoot.position.y =heightOfTable - heightOfTableFoot/2;
    scene.add(tableFoot);
}

function createChair(chairX, chairY, chairZ, xRot, yRot, zRot, color) {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    
    const extrudeSettings = {
      steps: 2,    
      depth: 2,  
      bevelEnabled: true,  
      bevelThickness: 1,  
      bevelSize: 1,  
      bevelSegments: 3,  
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({color});
    const heart = new THREE.Mesh(geometry, material);
    heart.position.x = 0;
    heart.scale.set(.15,.15,.15);
    heart.rotateX(xRot);
    heart.rotateY(yRot);
    heart.rotateZ(zRot);
    heart.position.x = chairX;
    heart.position.y = chairY;
    heart.position.z = chairZ;
    scene.add(heart);
}

export function createTableScene() {
    var tableColor = 0xa3d1d6;
    var chairColor = 0xeac9ff;
    createTableSurface(tableColor);
    createTableFoot(tableColor);
    createChair(-6, -.5, 0, Math.PI/2, 0, -Math.PI/4 , chairColor);
    createChair(6, -.5, -1, Math.PI/2, 0, Math.PI/4, chairColor);
    createChair(-6, 1.2, 0, Math.PI/1, -Math.PI/4 , 0, chairColor);
    createChair(6, 1.2, -1, Math.PI/1, Math.PI/4 , 0, chairColor);
    drawTableObjs(1);
}