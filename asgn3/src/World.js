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
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
  if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;
  } else if (u_whichTexture == -1) {
    gl_FragColor =  vec4(v_UV, 1.0, 1.0);
  } else if (u_whichTexture == 0) {
    gl_FragColor = texture2D(u_Sampler0, v_UV);
  } else {
    gl_FragColor = vec4(1,.2,.2,1); 
  }
  }`;

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
let u_Sampler0;
let u_whichTexture;

let g_globalAngleX = -30;
let g_globalAngleY = 0;
let g_mainWingAngle = 225;
let g_midWingAngle = -90;
let g_tipWingAngle = 50;
let g_startTime = performance.now() / 1000.0;
let g_seconds = 0;
let g_animation = true;
let g_showBone = 0.1;
let g_eye = new Vector3([-2, -1, 3]);
let g_at = new Vector3([100, 0, -100]);
let g_up = new Vector3([0, 1, 0]);

let g_eye_x = .05;
let g_pupilx = .027;
let g_blink = true;
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
  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
  var modelMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

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

var g_map = [
  [1, 1, 1, 1, 1, 1, 1 ,1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
]
function drawMap() {
  for (x=0; x <8;x++) {
    for (y=0;y<8;y++) {
      if (g_map[x][y]==1){
        var body = new Cube();
        body.color = [1.0,1.0,1.0,1.0];
        body.matrix.translate(x-4,-2,y-4);
        body.render();
      }
    }
  }
}
function renderScene() {
  // Check the time at the start of this fuction
  var startTime = performance.now();

  var projMatrix = new Matrix4();
  projMatrix.setPerspective(50, 1 * canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2], g_at.elements[0], g_at.elements[1], g_at.elements[2], g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0).rotate(g_globalAngleY, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderHead();
  renderBody();
  renderLeftWing();
  renderRightWing();
  // var head = new Cube();
  // head.matrix.scale(0.6, .6, .6);
  // head.render();

  var floor = new Cube();
  floor.color = [2,.3,.2,1];
  floor.matrix.translate(0,-2,0);
  floor.matrix.scale(10,0,10);
  floor.matrix.translate(-.5,1,-.5);
  floor.render();

  var sky = new Cube();
  sky.color = [0,0,1.0,1];
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.render();

  drawMap();
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

function initTextures() {
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () { sendImageToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = 'wave.png';
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture');
}

function keydown(ev) {
  var vecD = new Vector3();
  vecD.set(g_at);
  vecD.sub(g_eye);
  if (ev.key === "w" || ev.key === "W") {
    vecD.normalize();
    g_eye.add(vecD);
    g_at.add(vecD);
  }
  else if (ev.key === "s" || ev.key === "S") {
    vecD.normalize();
    g_eye.sub(vecD);
    g_at.sub(vecD);
  }
  else if (ev.key === "a" || ev.key === "A") {
    vecD.normalize();
    var left = Vector3.cross(vecD, g_up);
    left.normalize();
    left.mul(-1);
    g_eye.add(left);
    g_at.add(left);
    // g_up.add(left);
  }
  else if (ev.key === "d" || ev.key === "D") {
    vecD.normalize();
    var right = Vector3.cross(vecD, g_up);
    right.normalize();
    // right.mul(-1);
    g_eye.add(right);
    g_at.add(right);
  }
  else if (ev.key === "q" || ev.key === "Q") {
    let rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(5, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
    let newVecD = rotationMatrix.multiplyVector3(vecD);
    var temp_eye = new Vector3;
    temp_eye.set(g_eye);
    temp_eye.add(newVecD);
    g_at.set(temp_eye);
  }
  else if (ev.key === "e" || ev.key === "E") {
    console.log("i am pressed")
    let rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-5, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
    let newVecD = rotationMatrix.multiplyVector3(vecD);
    var temp_eye = new Vector3;
    temp_eye.set(g_eye);
    temp_eye.add(newVecD);
    g_at.set(temp_eye);
  }
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();
  document.onkeydown = keydown;
  canvas.addEventListener('mousemove', (ev) => {

    // Normalize coordinates (-1 to 1 range)
    const xRatio = (ev.clientX / canvas.width) * 2 - 1;
    const yRatio = (ev.clientY / canvas.height) * 2 - 1;

    g_globalAngleX = xRatio * 100;
    g_globalAngleY = yRatio * 100;

    renderScene();
  });
  canvas.addEventListener('click', (event) => {
    const isShiftClick = event.shiftKey;
    if (isShiftClick) {
      g_blink = !g_blink;
      renderScene();
    }
  });
  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderScene();
  requestAnimationFrame(tick);
  //drawCny();
}