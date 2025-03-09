import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export function loadCakeObj(scene) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../resources/cake/obj.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('../resources/cake/tinker.obj', (cakeObj) => {
            console.log("model loaded")
            cakeObj.scale.set(0.01, 0.01, 0.01);  // Scale down model
            cakeObj.rotation.x = - Math.PI / 2;
            cakeObj.position.y = 1;
            scene.add(cakeObj);
        });
    });
}
