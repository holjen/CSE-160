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

function renderHead(location, skinColor) {
    var head = new Cube();
    head.color = skinColor;
    head.matrix.translate(location.location[0], location.location[1], location.location[2]);
    head.matrix.rotate(180,1,0,0);
    head.matrix.rotate(location.rotation[0], location.rotation[1], location.rotation[2], location.rotation[3]);
    var headLoc = new Matrix4(head.matrix);
    head.matrix.scale(0.6, .6, .4);
    head.renderFastUVNormal();

    var eye1 = new Cube();
    eye1.color = [0,0,0,1];
    eye1.matrix = new Matrix4(headLoc);
    eye1.matrix.translate(.1,0.3,-0.001);
    eye1.matrix.scale(.1,.15,.15);
    eye1.renderFastUVNormal();

    var eye2 = new Cube();
    eye2.color = [0,0,0,1];
    eye2.matrix = new Matrix4(headLoc);
    eye2.matrix.translate(.4,0.3,-.001);
    eye2.matrix.scale(.1,.15,.15);
    eye2.renderFastUVNormal();

    var neck = new Cube();
    neck.color = skinColor;
    neck.matrix = new Matrix4(headLoc);
    neck.matrix.translate(.21,.5,0.3);
    neck.matrix.rotate(90,0,1,0);
    neck.matrix.scale(.2,.2,.2);
    neck.renderFastUVNormal();
    return headLoc;
}

function renderShirt(headLoc, shirtColor) {
    var shirt = new Cube();
    shirt.color = shirtColor;
    shirt.matrix = new Matrix4(headLoc);
    shirt.matrix.translate(0.05,.7,0);
    shirt.matrix.scale(.55,.6,.4);
    shirt.renderFastUVNormal();

    var sleeve1 = new Cube();
    sleeve1.color = shirtColor;
    sleeve1.matrix = new Matrix4(headLoc);
    sleeve1.matrix.translate(-.23,.93,0);
    sleeve1.matrix.rotate(-40,0,0,1);
    sleeve1.matrix.scale(.35,.25,.4);
    sleeve1.renderFastUVNormal(); 
    
    var sleeve2 = new Cube();
    sleeve2.color = shirtColor;
    sleeve2.matrix = new Matrix4(headLoc);
    sleeve2.matrix.translate(.61,.7,0);
    sleeve2.matrix.rotate(40,0,0,1);
    sleeve2.matrix.scale(.35,.25,.4);
    sleeve2.renderFastUVNormal();
}

function renderArms(headLoc, skinColor) {
    var arm1  = new Cube();
    arm1.color = skinColor;
    arm1.matrix = new Matrix4(headLoc);
    arm1.matrix.translate(-.34,1.05,0.05);
    arm1.matrix.rotate(-40,0,0,1);
    arm1.matrix.scale(.15,.18,.3);
    arm1.renderFastUVNormal();

    var arm2 = new Cube();
    arm2.color = skinColor;
    arm2.matrix = new Matrix4(headLoc);
    arm2.matrix.translate(.86,.95,0.05);
    arm2.matrix.rotate(40,0,0,1);
    arm2.matrix.scale(.15,.18,.3);
    arm2.renderFastUVNormal();
}

function renderPants(headLoc, pantsColor) {
    var pantsHip = new Cube();
    pantsHip.color = pantsColor;
    pantsHip.matrix = new Matrix4(headLoc);
    pantsHip.matrix.translate(.06,1.3,0);
    pantsHip.matrix.scale(.55,.3,.4);
    pantsHip.renderFastUVNormal();

    var leg = new Cube();
    leg.color = pantsColor;
    leg.matrix = new Matrix4(headLoc);
    leg.matrix.translate(0.33,1.5,-0.001);
    leg.matrix.rotate(-80 +180,0,0,1);
    leg.matrix.scale(.45,.25,.4);
    leg.renderFastUVNormal();

    leg.matrix = new Matrix4(headLoc);
    leg.color = pantsColor;
    leg.matrix.translate(.43,1.95,-0.001);
    leg.matrix.rotate(180+80,0,0,1);
    leg.matrix.scale(.45,.25,.4);
    leg.renderFastUVNormal();
}

function renderShoes(headLoc){
    var shoes = new Cube();
    shoes.color = [0,0,0,1];
    shoes.matrix = new Matrix4(headLoc);
    shoes.matrix.translate(0,2,0);
    shoes.matrix.rotate(-80,0,0,1);
    shoes.matrix.scale(.15,.21,.4);
    shoes.renderFastUVNormal();

    shoes.matrix = new Matrix4(headLoc);
    shoes.matrix.translate(.66,1.85,0);
    shoes.matrix.rotate(80,0,0,1);
    shoes.matrix.scale(.15,.21,.4);
    shoes.renderFastUVNormal();
}

function renderHair(headLoc, cosmetics, hairLength) {
    // top of hiar
    var hair = new Cube();
    hair.color = cosmetics.hairColor;
    hair.matrix = new Matrix4(headLoc);
    hair.matrix.translate(0,-.1,-.1);
    hair.matrix.scale(.6,.1,.5);
    hair.renderFastUVNormal();

    // bangs
    hair.matrix = new Matrix4(headLoc);
    hair.matrix.translate(-0.01,-.02,-.1);
    hair.matrix.scale(.61,.15,.1);
    hair.renderFastUVNormal();
    //left side of hair
    hair.matrix = new Matrix4(headLoc);
    hair.matrix.translate(.6,-.1,-.1);
    hair.matrix.scale(.05,.38 * hairLength,.5);
    hair.renderFastUVNormal();

    // right side of hair
    hair.matrix = new Matrix4(headLoc);
    hair.matrix.translate(-.05,-.1,-.1);
    hair.matrix.scale(.05,.38 * hairLength,.5);
    hair.renderFastUVNormal();
    // back of hair
    hair.matrix = new Matrix4(headLoc);
    hair.matrix.translate(-0.05,-.1,.4);
    hair.matrix.scale(.7,.6 * hairLength,.1);
    hair.renderFastUVNormal();
}

function renderHuman(location, cosmetics) {
    var headLocation = renderHead(location, cosmetics.skinColor);
    renderShirt(headLocation, cosmetics.shirtColor);
    renderArms(headLocation, cosmetics.skinColor);
    renderPants(headLocation, cosmetics.pantsColor);
    renderShoes(headLocation);
    if (cosmetics.hairType == 1) {
        renderHair(headLocation, cosmetics, 1);
    }
    else if (cosmetics.hairType == 2) {
        renderHair(headLocation, cosmetics, 2);
    }
}