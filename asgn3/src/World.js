// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
  }`;

// CONSTS
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;


let g_shapesList = [];
let g_selectedColor = [.5, .5, .5, 1.0];
let g_selectedType = POINT;
let g_globalAngleX = -30;
let g_globalAngleY = -15;
let g_mainWingAngle = 225;
let g_midWingAngle = -90;
let g_tipWingAngle = 50;
let g_startTime = performance.now() / 1000.0;
let g_seconds = 0;
let g_animation = false;
let g_showBone = 0.1;

let g_eye_x = .05;
let g_pupilx = .027;
let g_blink = false;
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingMainBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // enables blending for opacity
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  var identityG = new Matrix4();
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityG.elements);
  var identityV = new Matrix4();
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityV.elements);
  var identityP = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityP.elements);
}

function convertMouseCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return ([x, y]);
}

function renderHead() {
  var head = new Cube();
  head.color = [1, .7, 1, 1];
  head.matrix.translate(-.6, 0.05, .025);
  head.matrix.rotate(120, 0, 0, 1);
  head.matrix.scale(0.1, .1, .1);
  head.render();

  var head2 = new Cube();
  head2.color = [1, .8, 1, 1];
  head2.matrix.translate(-.5, .1, 0);
  head2.matrix.rotate(120, 0, 0, 1);
  head2.matrix.scale(.15, .15, .15);
  head2.render();

  var eye = new Cube();
  eye.color = [0, 0, 0, 1];
  eye.matrix.translate(-.57, .13, -.03);
  eye.matrix.rotate(120, 0, 0, 1);
  eye.matrix.scale(g_eye_x, .05, .2);
  eye.render();

  var eye2 = new Cube();
  eye2.color = [1, 1, 1, 1];
  eye2.matrix.translate(-.59, .13, -.031);
  eye2.matrix.rotate(120, 0, 0, 1);
  eye2.matrix.scale(g_pupilx, .025, .21);
  eye2.render();

  var neck = new Cube();
  neck.color = [1, .8, 1, 1];
  neck.matrix.translate(-0.5, -.3, 0);
  neck.matrix.rotate(15, 0, 0, 1);
  neck.matrix.scale(.1, .45, .15);
  neck.render();
  var beak = new Cone();
  beak.color = [1, .5, 0, 1];
  beak.height = .15;
  beak.segments = 10;
  beak.radius = 15;
  beak.matrix.translate(-.7, .05, 0.08);
  beak.matrix.rotate(120, 0, 0, 1);
  beak.render();
}

function createBodyFeathers(loc, r) {
  var cone = new Cone();
  cone.color = [1, .7, 1, 1];
  cone.height = .2;
  cone.segments = 3;
  cone.radius = 20;
  cone.matrix.translate(loc[0], loc[1], loc[2]);
  cone.matrix.rotate(r[0], r[1], r[2], r[3]);
  cone.render();
}

function renderBody() {
  var belly = new Cube();
  belly.color = [1, .8, 1, 1];
  belly.matrix.translate(-0.5, -.5, -.05);
  belly.matrix.scale(.65, .25, .25);
  belly.render();

  for (let i = 0; i < 6; i++) {
    createBodyFeathers([-0.45 + i / 10, -.45, 0.2], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.35, 0.2], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.25, 0.2], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.25, 0.07], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.25, -0.05], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.35, -0.05], [250, 0, 0, 1]);
    createBodyFeathers([-0.45 + i / 10, -.45, -0.05], [250, 0, 0, 1]);
  }
  for (let i = 0; i < 3; i++) {
    createBodyFeathers([-0.45, -.25 - i / 13, 0.07], [150, 0, 0, 1]);
    createBodyFeathers([-0.45, -.25 - i / 13, 0.15], [150, 0, 0, 1]);
    createBodyFeathers([-0.45, -.25 - i / 13, -0.0], [150, 0, 0, 1]);
  }
  for (let i = 0; i < 3; i++) {
    createBodyFeathers([.15, -.3 - i / 13, 0.07], [230, 0, 0, 1]);
    createBodyFeathers([.15, -.3 - i / 13, 0.15], [230, 0, 0, 1]);
    createBodyFeathers([.15, -.3 - i / 13, -0.0], [230, 0, 0, 1]);
  }
}

function createFeather(bone, loc, s, r) {
  var feather = new Cube();
  feather.color = [1, .5, 1, 1];
  feather.matrix = new Matrix4(bone);
  feather.matrix.translate(loc[0], loc[1], loc[2]);
  feather.matrix.rotate(r[0], r[1], r[2], r[3]);
  feather.matrix.scale(s[0], s[1], s[2]);
  feather.render();
}

function renderLeftWing() {
  var wingMain = new Cube();
  wingMain.color = [1, .5, 1, g_showBone];
  wingMain.matrix.translate(-0.4, -.3, 0);
  wingMain.matrix.rotate(g_mainWingAngle, 1, 0, 0)
  var wingMainLoc = new Matrix4(wingMain.matrix);
  wingMain.matrix.scale(.15, .05, .45);
  wingMain.render();

  var wingMid = new Cube();
  wingMid.matrix = new Matrix4(wingMainLoc);
  wingMid.color = [1, .5, 1, g_showBone];
  wingMid.matrix.translate(0, 0, .45);
  wingMid.matrix.rotate(g_midWingAngle, 1, 0, 0);
  var wingMidLoc = new Matrix4(wingMid.matrix);
  wingMid.matrix.scale(.15, .05, .35);
  wingMid.render();

  var wingTip = new Cube();
  wingTip.matrix = new Matrix4(wingMidLoc);
  wingTip.color = [1, .5, 1, g_showBone];
  wingTip.matrix.translate(0, 0, .4);
  wingTip.matrix.rotate(g_tipWingAngle, 1, 0, 0);
  var wingTipLoc = new Matrix4(wingTip.matrix);
  wingTip.matrix.scale(.15, .05, .2);
  wingTip.render();

  // feathers along the main wing
  for (let i = 0; i < 10; i++) {
    createFeather(wingMainLoc, [0.05, -.05, 0 + i / 20], [.2 + i / 50, .05, .05], [0, 1, 0, 0]);
  }
  for (let i = 0; i < 7; i++) {
    createFeather(wingMidLoc, [0.05, -.05, 0 + i / 20], [.35 + i / 50, .05, .05], [0, 1, 0, 0]);
  }
  for (let i = 0; i < 5; i++) {
    createFeather(wingTipLoc, [0.05, -.05, -0.1 + i / 20], [.45 + i / 30, .05, .05], [-10 - i * 10, 0, 1, 0]);
  }
}

function renderRightWing() {
  var wingMain = new Cube();
  wingMain.color = [1, .5, 1, g_showBone];
  wingMain.matrix.translate(-0.25, -.3, 0.15);
  wingMain.matrix.rotate(180, 0, 1, 0).rotate(g_mainWingAngle, 1, 0, 0)
  var wingMainLoc = new Matrix4(wingMain.matrix);
  wingMain.matrix.scale(.15, .05, .45);
  wingMain.render();
  var wingMid = new Cube();
  wingMid.matrix = new Matrix4(wingMainLoc);
  wingMid.color = [1, .5, 1, g_showBone];
  wingMid.matrix.translate(0, 0, .45);
  wingMid.matrix.rotate(g_midWingAngle, 1, 0, 0);
  var wingMidLoc = new Matrix4(wingMid.matrix);
  wingMid.matrix.scale(.15, .05, .35);
  wingMid.render();

  var wingTip = new Cube();
  wingTip.matrix = new Matrix4(wingMidLoc);
  wingTip.color = [1, .5, 1, g_showBone];
  wingTip.matrix.translate(0, 0, .4);
  wingTip.matrix.rotate(g_tipWingAngle, 1, 0, 0);
  var wingTipLoc = new Matrix4(wingTip.matrix);
  wingTip.matrix.scale(.15, .05, .2);
  wingTip.render();

  for (let i = 0; i < 10; i++) {
    createFeather(wingMainLoc, [0.1, -.05, .05 + i / 20], [.2 + i / 50, .05, .05], [180, 0, 1, 0]);
  }
  for (let i = 0; i < 7; i++) {
    createFeather(wingMidLoc, [0.1, -.05, 0.05 + i / 20], [.35 + i / 50, .05, .05], [180, 0, 1, 0]);
  }
  for (let i = 0; i < 5; i++) {
    createFeather(wingTipLoc, [0.1, -.05, -0.05 + i / 20], [.45 + i / 30, .05, .05], [180 + 10 + i * 10, 0, 1, 0]);
  }
}

function renderScene() {
  // Check the time at the start of this fuction
  var startTime = performance.now();
  var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0).rotate(g_globalAngleY, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // renderHead();
  // renderBody();
  // renderLeftWing();
  // renderRightWing();
  console.log("rendering");
  var head = new Cube();
  head.color = [1, .7, 1, 1];
  head.matrix.translate(-.6, 0.05, .025);
  head.matrix.rotate(120, 0, 0, 1);
  head.matrix.scale(0.1, .1, .1);
  head.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID);
    return;
  }
  htmlElm.innerHTML = text;
}

function addActionsForHtmlUI() {
  document.getElementById('Cam').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderScene(); });
  document.getElementById('MainWing').addEventListener('mousemove', function () { g_mainWingAngle = this.value; renderScene(); });
  document.getElementById('MidWing').addEventListener('mousemove', function () { g_midWingAngle = this.value; renderScene(); });
  document.getElementById('TipWing').addEventListener('mousemove', function () { g_tipWingAngle = this.value; renderScene(); });
  document.getElementById('animationOn').onclick = function () { g_animation = true; };
  document.getElementById('animationOff').onclick = function () { g_animation = false; };
}

function updateAnimationAngles() {
  if (g_animation) {
    g_mainWingAngle = 185 + (55 * Math.sin(g_seconds));
    g_midWingAngle = 0 - (25 * Math.sin(g_seconds));
    g_tipWingAngle = 0 - (25 * Math.sin(g_seconds));
  }
  if (g_blink) {
    g_pupilx = (.027 * Math.abs(Math.sin(g_seconds)));
  }
}

function tick() {
  g_seconds = (performance.now() / 1000.0) - g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();
  canvas.addEventListener('mousemove', (ev) => {

    // Normalize coordinates (-1 to 1 range)
    const xRatio = (ev.clientX / canvas.width) * 2 - 1;
    const yRatio = (ev.clientY / canvas.height) * 2 - 1;

    g_globalAngleX = xRatio * 360;
    g_globalAngleY = yRatio * 360;

    renderScene();
  });
  canvas.addEventListener('click', (event) => {
    const isShiftClick = event.shiftKey;
    if (isShiftClick) {
      g_blink = !g_blink;
      renderScene();
    }
  });
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderScene();
  requestAnimationFrame(tick);
  //drawCny();
}