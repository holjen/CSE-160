import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { scene } from "./initWorld.js";
function loadCakeObj(y) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../resources/objects/cake/obj.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('../resources/objects/cake/tinker.obj', (cakeObj) => {
            cakeObj.scale.set(0.015, 0.015, 0.015);
            cakeObj.rotation.x = - Math.PI / 2;
            cakeObj.position.y = y;
            cakeObj.position.x = -0.5;
            cakeObj.position.z = -1.5;
            scene.add(cakeObj);
        });
    });
}

function highTea(y) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../resources/objects/highTea/materials.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('../resources/objects/highTea/model.obj', (highTeaObj) => {
            highTeaObj.scale.set(3.3, 3.3, 3.3);
            highTeaObj.position.y = y;
            highTeaObj.position.x = -1.5;
            scene.add(highTeaObj);
        });
    });
}

function cupOfTea(x, y, z, rotY) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../resources/objects/cupOfTea/cupOfTea.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('../resources/objects/cupOfTea/cupOfTea.obj', (teacupObj) => {
            teacupObj.rotation.y = rotY;
            teacupObj.scale.set(.2, .2, .2);
            teacupObj.position.y = y;
            teacupObj.position.x = x;
            teacupObj.position.z = z;
            scene.add(teacupObj);
        });
    });
}

function teapot(y) {
    const objLoader = new OBJLoader();
    objLoader.load('../resources/objects/teapot/model.obj', (teapot) => {
    
        teapot.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: 0xede4ed, 
                });
            }
        });
    
        teapot.scale.set(2.5,2.5,2.5);
        teapot.position.x = 1.2;
        teapot.position.y = y;
        teapot.rotation.y = Math.PI * -1.1;
        scene.add(teapot);
    });
}
export function drawTableObjs(y) {
    loadCakeObj(y);
    highTea(y + .7);
    cupOfTea(-1.8, y + .1, 1.5, Math.PI);
    cupOfTea(1.8, y + .1, 1.5, -Math.PI / 2);
    teapot(y+.8);
}