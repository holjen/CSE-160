class Wall {
    constructor({ textureN = [], height = [], color = [], size = [] } = {}) {
        this.type = "Wall";
        this.textureN = textureN;
        this.height = height;
        this.color = color;
        this.size = size;
    }
}

var mapSize = 36;
var g_map = [];
function createMap() {
    for (i = 0; i < mapSize; i++) {
        let row = new Array(mapSize).fill(0);
        g_map.push(row);
    }
}
var blocksToPlace = [];
function drawMap() {
    createMap();
    var body = new Cube();
    var wall = new Wall();
    wall.textureN = [-2, 0, 1, 2];
    wall.height = [0, 1, 2, 3];
    g_map[0][0] = wall;
    createOuterWalls();
    createInnerWalls();
    for (x = 0; x < mapSize; x++) {
        for (y = 0; y < mapSize; y++) {
            if (g_map[x][y] == 0) {
                continue;
            }
            // console.log("x: "+x + " y : "+ y);
            // console.log("map[x][y]: "+g_map[x][y]);
            var wallObj = g_map[x][y]
            for (s = 0; s < wallObj.height.length; s++) {
                body.matrix.setIdentity();
                if (wallObj.color.length != 0) {
                    body.color = wallObj.color[s];
                }
                else {
                    body.color = [1.0, 1.0, 1.0, 1.0];
                }
                var sizeScale;
                if (wallObj.size.length != 0) {
                    sizeScale = wallObj.size[s];
                }
                else {
                    sizeScale = [.75, .75, .75]
                }
                body.matrix.translate((x - 4) * sizeScale[0], -1 + wallObj.height[s] * sizeScale[1], (y - 4) * sizeScale[2]);
                body.matrix.scale(sizeScale[0], sizeScale[1], sizeScale[2]);
                body.textureNum = wallObj.textureN[s];
                body.renderFastUV();
            }
        }
    }
}

function drawFloor() {
    var floor = new Cube();
    floor.color = [.5, .5, .5, 1];
    floor.matrix.translate(0, -1.0001, 0);
    floor.matrix.scale(100, 0, 100);
    floor.matrix.translate(-.5, 1, -.5);
    floor.renderFastUV();
}

function drawSky() {
    // var sky = new Cube();
    // sky.color = [1, 1, 1.0, 1];
    // sky.matrix.scale(-80, -80, -80);
    // sky.matrix.translate(-.5, -.5, -.5);
    // sky.renderWShading();
    var sky = new Cube();
    sky.textureNum = -3;
    sky.color = [.5, 1, 1.0, 1];
    sky.matrix.scale(-15, -10, -15);
    sky.matrix.translate(-1, -.5, -.5);
    sky.renderFastUVNormal();
}

function createOuterWalls() {
    // front
    for (x = 0; x < mapSize; x++) {
        if (x % 6 == 0) {
            g_map[x][0] = new Wall({ textureN: [0, 1, 2, 2], height: [0, 1, 2, 3] });
        }
        else {
            g_map[x][0] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
    // back
    for (x = 0; x < mapSize; x++) {
        if (x % 6 == 0) {
            g_map[x][mapSize - 1] = new Wall({ textureN: [0, 1, 2, 2], height: [0, 1, 2, 3] });
        }
        else {
            g_map[x][mapSize - 1] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
    // right - the map is fliped left to right
    for (y = 0; y < mapSize; y++) {
        if (y % 6 == 0) {
            g_map[0][y] = new Wall({ textureN: [0, 1, 2, 2], height: [0, 1, 2, 3] });
        }
        else {
            g_map[0][y] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
    // right - the map is fliped left to right
    for (y = 0; y < mapSize; y++) {
        if (y % 6 == 0) {
            g_map[mapSize - 1][y] = new Wall({ textureN: [0, 1, 2, 2], height: [0, 1, 2, 3] });
        }
        else {
            g_map[mapSize - 1][y] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
}


function createInnerWalls() {
    var innerWallSizeY = 28;
    var innerWallSizeX = 25;
    var outerMInnerY = mapSize - innerWallSizeY;
    var outerMInnerX = mapSize - innerWallSizeX;
    // front
    for (x = outerMInnerX; x < innerWallSizeX; x++) {
        // if (x == (innerWallSizeX - outerMInnerX) / 2 || x == 1 + (innerWallSizeX - outerMInnerX) / 2) {
        //     continue;
        // }
        g_map[x][outerMInnerY] = new Wall({ textureN: [-2, -2], height: [0, 1.5], color: [[149 / 255, 69 / 255, 53 / 255, 1.0], [1, .99, .75, 1.0]], size: [[.75, .3, .75], [.75, .2, .75]] });
    }
    // // back
    for (x = outerMInnerX; x < innerWallSizeX; x++) {
        // if (x == (innerWallSizeY - outerMInnerY) / 2 || x == 1 + (innerWallSizeY - outerMInnerY) / 2) {
        //     continue;
        // }
        g_map[x][innerWallSizeY - 1] = new Wall({ textureN: [-2, -2], height: [0, 1.5], color: [[149 / 255, 69 / 255, 53 / 255, 1.0], [1, .99, .75, 1.0]], size: [[.75, .3, .75], [.75, .2, .75]] });
    }
    // // // right - the map is fliped left to right
    for (y = outerMInnerY; y < innerWallSizeY; y++) {
        if (y == outerMInnerY + 5 || y == innerWallSizeY - 5) {
            continue;
        }
        if (y < outerMInnerY + 7 || y > innerWallSizeY - 7) {
            g_map[outerMInnerX][y] = new Wall({ textureN: [-2, -2], height: [0, 1.5], color: [[149 / 255, 69 / 255, 53 / 255, 1.0], [1, .99, .75, 1.0]], size: [[.75, .3, .75], [.75, .2, .75]] });
        }
        else {
            g_map[outerMInnerX][y] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
    // right - the map is fliped left to right
    for (y = outerMInnerY; y < innerWallSizeY; y++) {
        if (y < outerMInnerY + 7 || y > innerWallSizeY - 7) {
            g_map[innerWallSizeX - 1][y] = new Wall({ textureN: [-2, -2], height: [0, 1.5], color: [[149 / 255, 69 / 255, 53 / 255, 1.0], [1, .99, .75, 1.0]], size: [[.75, .3, .75], [.75, .2, .75]] });
        }
        else {
            g_map[innerWallSizeX - 1][y] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        }
    }
    // // wall behind counter
    for (x = outerMInnerX; x < innerWallSizeX; x++) {
        g_map[x][outerMInnerY + 7] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
        g_map[x][innerWallSizeY - 7] = new Wall({ textureN: [2, 2, 2, 2], height: [0, 1, 2, 3] });
    }
}