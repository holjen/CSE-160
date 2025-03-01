class locationAttributes {
    constructor({ location = [], rotation = [0, 0, 0, 1] } = {}) {
        this.type = "location";
        this.location = location
        this.rotation = rotation
    }
}
class cosmeticAttributes {
    constructor({ hairType = 0, hairColor = [0,0,0,1], skinColor = [1,219/255,172/255,1], shirtColor = [0,154/255,205/255,1], pantsColor = [54/255,100/255,139/255,1] } = {}) {
        this.type = "cosmetic";
        this.hairType = hairType;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.shirtColor = shirtColor;
        this.pantsColor = pantsColor;
    }
}

function renderHead(location, skinColor, cube) {
    // head
    cube.matrix.setIdentity();
    cube.color = skinColor;
    cube.matrix.translate(location.location[0], location.location[1], location.location[2]);
    cube.matrix.rotate(180,1,0,0);
    cube.matrix.rotate(location.rotation[0], location.rotation[1], location.rotation[2], location.rotation[3]);
    var headLoc = new Matrix4(cube.matrix);
    cube.matrix.scale(0.6, .6, .4);
    cube.renderFastUVNormal();

    // eye1
    cube.matrix.setIdentity();
    cube.color = [0,0,0,1];
    cube.matrix.set(headLoc);
    cube.matrix.translate(.1,0.3,-0.001);
    cube.matrix.scale(.1,.15,.15);
    cube.renderFastUVNormal();

    cube.matrix.setIdentity();
    cube.color = [0,0,0,1];
    cube.matrix.set(headLoc);
    cube.matrix.translate(.4,0.3,-.001);
    cube.matrix.scale(.1,.15,.15);
    cube.renderFastUVNormal();

    cube.matrix.setIdentity();
    cube.color = skinColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(.21,.5,0.3);
    cube.matrix.rotate(90,0,1,0);
    cube.matrix.scale(.2,.2,.2);
    cube.renderFastUVNormal();
    return headLoc;
}

function renderShirt(headLoc, shirtColor, cube) {
    cube.matrix.setIdentity();
    cube.color = shirtColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(0.05,.7,0);
    cube.matrix.scale(.55,.6,.4);
    cube.renderFastUVNormal();
    
    cube.matrix.setIdentity();
    cube.color = shirtColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(-.23,.93,0);
    cube.matrix.rotate(-40,0,0,1);
    cube.matrix.scale(.35,.25,.4);
    cube.renderFastUVNormal(); 
    
    cube.matrix.setIdentity();
    cube.color = shirtColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(.61,.7,0);
    cube.matrix.rotate(40,0,0,1);
    cube.matrix.scale(.35,.25,.4);
    cube.renderFastUVNormal();
}

function renderArms(headLoc, skinColor, cube) {
    cube.matrix.setIdentity();
    cube.color = skinColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(-.34,1.05,0.05);
    cube.matrix.rotate(-40,0,0,1);
    cube.matrix.scale(.15,.18,.3);
    cube.renderFastUVNormal();

    cube.matrix.setIdentity();
    cube.color = skinColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(.86,.95,0.05);
    cube.matrix.rotate(40,0,0,1);
    cube.matrix.scale(.15,.18,.3);
    cube.renderFastUVNormal();
}

function renderPants(headLoc, pantsColor, cube) {
    // shirt
    cube.matrix.setIdentity();
    cube.color = pantsColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(.06,1.3,0);
    cube.matrix.scale(.55,.3,.4);
    cube.renderFastUVNormal();

    // sleeve 1
    cube.matrix.setIdentity();
    cube.color = pantsColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(0.33,1.5,-0.001);
    cube.matrix.rotate(-80 +180,0,0,1);
    cube.matrix.scale(.45,.25,.4);
    cube.renderFastUVNormal();

    // sleeve 2
    cube.matrix.set(headLoc);
    cube.color = pantsColor;
    cube.matrix.translate(.43,1.95,-0.001);
    cube.matrix.rotate(180+80,0,0,1);
    cube.matrix.scale(.45,.25,.4);
    cube.renderFastUVNormal();
}

function renderShoes(headLoc, cube){
    cube.matrix.setIdentity();
    cube.color = [0,0,0,1];
    cube.matrix.set(headLoc);
    cube.matrix.translate(0,2,0);
    cube.matrix.rotate(-80,0,0,1);
    cube.matrix.scale(.15,.21,.4);
    cube.renderFastUVNormal();

    cube.matrix.set(headLoc);
    cube.matrix.translate(.66,1.85,0);
    cube.matrix.rotate(80,0,0,1);
    cube.matrix.scale(.15,.21,.4);
    cube.renderFastUVNormal();
}

function renderHair(headLoc, cosmetics, hairLength, cube) {
    // top of hiar
    cube.matrix.setIdentity();
    cube.color = cosmetics.hairColor;
    cube.matrix.set(headLoc);
    cube.matrix.translate(0,-.1,-.1);
    cube.matrix.scale(.6,.1,.5);
    cube.renderFastUVNormal();

    // bangs
    cube.matrix.set(headLoc);
    cube.matrix.translate(-0.01,-.02,-.1);
    cube.matrix.scale(.61,.15,.1);
    cube.renderFastUVNormal();
    //left side of hair
    cube.matrix.set(headLoc);
    cube.matrix.translate(.6,-.1,-.1);
    cube.matrix.scale(.05,.38 * hairLength,.5);
    cube.renderFastUVNormal();

    // right side of hair
    cube.matrix.set(headLoc);
    cube.matrix.translate(-.05,-.1,-.1);
    cube.matrix.scale(.05,.38 * hairLength,.5);
    cube.renderFastUVNormal();
    // back of hair
    cube.matrix.set(headLoc);
    cube.matrix.translate(-0.05,-.1,.4);
    cube.matrix.scale(.7,.6 * hairLength,.1);
    cube.renderFastUVNormal();
}

function renderHuman(location, cosmetics) {
    var cube = new Cube();
    var headLocation = renderHead(location, cosmetics.skinColor, cube);
    renderShirt(headLocation, cosmetics.shirtColor, cube);
    renderArms(headLocation, cosmetics.skinColor, cube);
    renderPants(headLocation, cosmetics.pantsColor, cube);
    renderShoes(headLocation, cube);
    if (cosmetics.hairType == 1) {
        renderHair(headLocation, cosmetics, 1, cube);
    }
    else if (cosmetics.hairType == 2) {
        renderHair(headLocation, cosmetics, 2, cube);
    }
}