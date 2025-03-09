import { initializeWorld, resizeRendererToDisplaySize, canvas, camera, scene, renderer } from './initWorld.js';
import { loadCakeObj } from './objects.js';
import { loadCubes, spinCubes } from './cubes.js';
import { createTable } from './shapes.js';
import { loadFloor } from './shapes.js';

let cubes;
function render(time) {
  time *= 0.001;  // convert time to seconds
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  spinCubes(cubes, time);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

function main() {
  initializeWorld();
  loadCakeObj(scene);
  cubes = loadCubes();
  loadFloor( -7);
  createTable();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

main();