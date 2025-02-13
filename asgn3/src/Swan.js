let g_mainWingAngle = 225;
let g_midWingAngle = -90;
let g_tipWingAngle = 50;
let g_startTime = performance.now() / 1000.0;
let g_seconds = 0;
let g_animation = true;
let g_showBone = 0.1;
let g_eye_x = .05;
let g_pupilx = .027;
let g_blink = true;
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