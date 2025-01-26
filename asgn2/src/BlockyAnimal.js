// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// CONSTS
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_shapesList = [];
let g_selectedColor = [.5, .5, .5, 1.0];
let g_selectedType = POINT;
let g_globalAngleX = 90;
let g_globalAngleY = 15;
let g_wingAngle = 0;


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
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  // // point size
  // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // if (!u_Size) {
  //   console.log('Failed to get the storage location of u_Size');
  //   return;
  // }
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
  head.color = [1, 1, 1, 1];
  head.matrix.translate(-.6, 0.05, .025);
  head.matrix.rotate(120, 0, 0, 1);
  head.matrix.scale(0.1, .1, .1);
  head.render();

  var head2 = new Cube();
  head2.color = [1, 1, 1, 1];
  head2.matrix.translate(-.5, .1, 0);
  head2.matrix.rotate(120, 0, 0, 1);
  head2.matrix.scale(.15, .15, .15);
  head2.render();

  var neck = new Cube();
  neck.color = [1, 1, 1, 1];
  neck.matrix.translate(-0.5, -.3, 0);
  neck.matrix.rotate(15, 0, 0, 1);
  neck.matrix.scale(.1, .45, .15);
  neck.render();
}

function renderBody() {
  var belly = new Cube();
  belly.color = [1, 0, 0, 1];
  belly.matrix.translate(-0.5, -.5, -.05);
  belly.matrix.scale(.65, .25, .25);
  belly.render();
}

function renderLeftWing() {
  var wingMain = new Cube();
  wingMain.color = [1,1,0,1];
  //wingMain.matrix.setTranslate(-0.4,-.3,-.45);
  //wingMain.matrix.translate(-0.4,-.3,-.45);
  wingMain.matrix.rotate(45,1,0,0)
  wingMain.matrix.translate(-0.4,-.3,-.45);
  var wingMainLoc = new Matrix4(wingMain.matrix);
  wingMain.matrix.scale(.15,.05,.65);
  wingMain.render();

  var wingMid = new Cube();
  wingMid.matrix = wingMainLoc;
  wingMid.color = [0,1,0,1];
  wingMid.matrix.rotate(90,1,0,0);
  var wingMidLoc = new Matrix4(wingMid.matrix);
  wingMid.matrix.scale(.15,.05,.45);
  wingMid.render();

  var wingTip = new Cube();
  wingTip.matrix = wingMidLoc;
  wingTip.color = [0,0,1,1];
  wingTip.matrix.rotate(90,1,0,0);
  wingTip.matrix.translate(-.0,.45,-0.05);
  wingTip.matrix.scale(.15,.05,.15);
  wingTip.render();
}

function renderRightWing() {
  var wingMain = new Cube();
  wingMain.color = [1,1,0,1];
  wingMain.matrix.rotate(180,0,1,0).rotate(45,1,0,0);
  wingMain.matrix.translate(.25,-.4,-.55);
  var wingMainLoc = new Matrix4(wingMain.matrix);
  wingMain.matrix.scale(.15,.05,.65);
  wingMain.render();

  var wingMid = new Cube();
  wingMid.matrix = wingMainLoc;
  wingMid.color = [0,1,0,1];
  wingMid.matrix.rotate(90,1,0,0);
  var wingMidLoc = new Matrix4(wingMid.matrix);
  wingMid.matrix.scale(.15,.05,.45);
  wingMid.render();

  var wingTip = new Cube();
  wingTip.matrix = wingMidLoc;
  wingTip.color = [0,0,1,1];
  wingTip.matrix.rotate(90,1,0,0);
  wingTip.matrix.translate(-.0,.45,-0.05);
  wingTip.matrix.scale(.15,.05,.15);
  wingTip.render();
}
function renderAllShapes() {
  // Check the time at the start of this fuction
  var startTime = performance.now();
  var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0).rotate(g_globalAngleY,1,0,0);
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderHead();
  renderBody();
  renderLeftWing();
  renderRightWing();
  // var len = g_shapesList.length;
  // for (var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  // var duration = performance.now() - startTime;
  // sendTextToHTML("ms: " + Math.floor(duration) + " fps: "+ Math.floor(10000/duration));
}

// function click(ev) {
//   [x, y] = convertMouseCoordinatesToGL(ev);

//   // Store the point into the shapesList
//   let point;
//   if (g_selectedType == POINT) {
//     point = new Point();
//   } else if (g_selectedType == TRIANGLE) {
//     point = new Triangle();
//   } else if (g_selectedType == CIRCLE) {
//     point = new Circle();
//     point.segments = g_selectedSeg;
//   }
//   console.log([x, y]);
//   point.position = [x, y];
//   point.color = g_selectedColor.slice();
//   point.size = g_selectedSize;
//   g_shapesList.push(point);

//   // Redraws all shapes onto the canvas
//   renderAllShapes();
// }

function addActionsForHtmlUI() {
  // RGB Sliders
  document.getElementById('Cam').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderAllShapes(); });
  document.getElementById('wing').addEventListener('mousemove', function () { g_wingAngle = this.value; renderAllShapes();});
  document.getElementById('Green').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
  document.getElementById('Blue').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });
  // Clear Button
  document.getElementById('Clear').onclick = function () { g_shapesList = []; renderAllShapes(); };
  // Shape Button
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

    // Re-render shapes with updated angles
    renderAllShapes();
  });
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderAllShapes();
  //drawCny();
}