import { initializeWorld, resizeRendererToDisplaySize, canvas, camera, scene, renderer } from './initWorld.js';
import { loadCakeObj } from './objects.js';
import { loadCubes, spinCubes } from './cubes.js';

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
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

main();