import { initializeWorld, resizeRendererToDisplaySize, canvas, camera, scene, renderer } from './initWorld.js';
import { loadCubes, spinCubes } from './cubes.js';
import { createTableScene } from './tableScene.js';
import { loadFloor } from './tableScene.js';
import * as THREE from 'three';
import { drawClouds, moveClouds } from './cloud.js';
let cubes;
let clouds;
function render(time) {
  time *= 0.001;  // convert time to seconds
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  //spinCubes(cubes, time);
  moveClouds(clouds, time * .25);
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

function main() {
  initializeWorld();
  //cubes = loadCubes();
  loadFloor( -7);
  createTableScene();
  clouds = drawClouds();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

main();