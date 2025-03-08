import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const fov = 75;
const aspect = 800/600;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//camera.position.set(0, 2, 5);  // Move the camera slightly up and back
camera.lookAt(0, 0, 0);        // Make sure it's looking at the scene center
camera.position.z = 4;
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
let canvas;
let renderer;
let scene;

function addLight() {
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function loadCakeObj() {
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('../cake/obj.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('../cake/tinker.obj', (root) => {
      console.log("model loaded")
      root.scale.set(0.01, 0.01, 0.01);  // Scale down if the model is too large
      root.rotation.x = - Math.PI/2;
      //root.position.set(0, -1, 0);    // Move it up if it's below the ground
      scene.add(root);
    });
  });
}
function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}

function main() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];
  loadCakeObj();
  function render(time) {
    time *= 0.001;  // convert time to seconds

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * .1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  renderer.render(scene, camera);
  addLight();
}

main();