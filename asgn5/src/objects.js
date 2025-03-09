import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export function loadCakeObj(scene) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../cake/obj.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('../cake/tinker.obj', (root) => {
            console.log("model loaded")
            root.scale.set(0.01, 0.01, 0.01);  // Scale down model
            root.rotation.x = - Math.PI / 2;
            scene.add(root);
        });
    });
}
