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
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
  if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;
  } else if (u_whichTexture == -1) {
    gl_FragColor =  vec4(v_UV, 1.0, 1.0);
  } else if (u_whichTexture == 0) {
    gl_FragColor = texture2D(u_Sampler0, v_UV);
  } else if (u_whichTexture == 1) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);
  } else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV);
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
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

let g_globalAngleX = -30;
let g_globalAngleY = 0;

// let g_eye = new Vector3([1.4, 0, -.3]);
// let g_at = new Vector3([0, 1, 1]);
// let g_up = new Vector3([0, 1, 0]);
let g_eye = new Vector3([0, 0, 0]);
let g_at = new Vector3([0, 0, -1]);
let g_up = new Vector3([0, 1, 0]);

function convertMouseCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return ([x, y]);
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

  // renderHead();
  // renderBody();
  // renderLeftWing();
  // renderRightWing();

  var head2 = new Cube();
  //head2.matrix.scale(0.6, .6, .6);
  head2.matrix.translate(0, .75, 0);
  head2.textureNum = 0;
  head2.renderFastUV();

  drawFloor();
  drawSky();

  drawMap();
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");
}

function initTextures() {
  var image0 = new Image(); 
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the image objects');
    return false;
  }
  // Register the event handler to be called on loading an image0
  image0.onload = function () { sendImageToTEXTURE0(image0, 0, u_Sampler0); };
  // Tell the browser to load an image0
  image0.src = 'doorbot.png';

  image1.onload = function () { sendImageToTEXTURE0(image1, 1, u_Sampler1); };
  image1.src = 'doortop.png';
  image2.onload = function () { sendImageToTEXTURE0(image2, 2, u_Sampler2); };
  image2.src = 'whiteWall.png';
  return true;
}

function sendImageToTEXTURE0(image, textureUnit, sampler) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image0's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image0
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(sampler, textureUnit);
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
  // console.log("button pressed: "+ ev.key);
  // console.log(g_eye);
  // console.log(g_at);
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

    g_globalAngleX = xRatio * 40;
    g_globalAngleY = yRatio * 40;

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