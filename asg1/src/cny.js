function drawTriangleStrip(vertices, rgba) {
    n = vertices.length / 2;
    // Color for character fu
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of the shape
    gl.uniform1f(u_Size, 4);

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    return n;
}

function convertSquareToPoint(vertices) {
    // 1 square on drawing is 0.07 in pts
    let convertedPts = [];
    for (let i = 0; i < vertices.length; i++) {
        convertedPts.push(vertices[i] * 0.07); // Multiply each vertex by 0.07
    }
    return convertedPts;
}

function drawLeftChar() {
    // left hand side the dot and straight
    var dot = convertSquareToPoint([-4.4, 6, -3, 6, -3, 4.8]);
    var org_array = [-6.5, 4, -5.8, 4, -6, 3.3, -1, 4, -1, 3.5, 0, 4]
    // left hande side the slant on the left
    org_array.push(...[-2, 3, -1, 3, -6.5, -1.6, -5.3, -1.2]);
    // left hand side the slant on the right
    left_slant = convertSquareToPoint([-3, 1, -3, 0, -2, 0, -2, -1, -1, -1, -1, -1.5]);
    // left hand side the bottom stick
    left_stick = convertSquareToPoint([-3, 1, -4, 0, -3, 0, -3.7, -6, -3, -5.5]);
    var rgba = [1.0, 0, 0, 1.0]
    var top_half = convertSquareToPoint(org_array);
    drawTriangleStrip(dot, rgba);
    drawTriangleStrip(top_half, rgba);
    drawTriangleStrip(left_slant, rgba);
    drawTriangleStrip(left_stick, rgba);
}

function drawRightChar() {
    var rgba = [1.0, 0, 0, 1.0]
    var dash = convertSquareToPoint([2.3, 5, 2.3, 5.5, 5, 5.5, 5, 5.8, 3.5, 5.3, 5, 5]);
    var kou = convertSquareToPoint([1.5, 4, 2, 4, 2, 1, 2.5, 1.5, 3, 1.3, 3, 1.5, 2.5, 1.5, 5.2, 1.8, 4.8, 1, 5, 1, 6, 1, 6, 4, 5.5, 3.5, 4.5, 3.8, 6, 4, 2, 4, 2, 3.5]);
    var field = convertSquareToPoint([0.4, 0, 1, -5, 1, 0, 1.5, -.7, 1, 0, 7, .3, 6, -.5, 6, 0, 7, .3, 6, -5, 6, -4, .6, -4.6]);
    var spinner_1 = convertSquareToPoint([4, -1, 3, -2, 4, -2, 4, -3, 5, -3]);
    var spinner_2 = convertSquareToPoint([2, -2, 3, -2, 3, -3, 4, -3, 3, -4])
    drawTriangleStrip(dash, rgba)
    drawTriangleStrip(kou, rgba)
    drawTriangleStrip(field, rgba);
    drawTriangleStrip(spinner_1, rgba)
    drawTriangleStrip(spinner_2, rgba)
    drawTriangleStrip(convertSquareToPoint([6, -2.5, 6, -4, 4, -5]), rgba);
};

function drawBelly() {
    var rgba = [165 / 255, 230 / 255, 188 / 255, 1.0];
    var belly_1 = convertSquareToPoint([-3.5, 6.5, -2.3, 6.7, -1.5, 6.3, -1, 7, 1.3, 7, 1.3, 6.2, 3.2, 6.3]);
    var belly_2 = convertSquareToPoint([2.5, 6.5, 4.3, 6, 5.8, 6.8, 5.8, 5.8, 6.5, 5.5]);
    var belly_3 = convertSquareToPoint([4.5, 6, 6, 6.5, 5.8, 5, 6.5, 5.5, 6.5, 4.8, 5.8, 5, 6.5, 3.5, 6.2, 3, 7.5, 1.8, 6.5, 5]);
    var tail_belly = convertSquareToPoint([-1.5, -7.7, -2.5, -6.8, -1.5, -7.8, -2.8, -7.8, -3.5, -8.5, -2, -9.5, -2, -7.8, -.8, -10]);
    drawTriangleStrip(belly_1, rgba);
    drawTriangleStrip(belly_2, rgba);
    drawTriangleStrip(belly_3, rgba);
    drawTriangleStrip(tail_belly, rgba);
}
function drawSnake() {
    drawBelly();
    var rgba = [42 / 255, 168 / 255, 86 / 255, 1.0]
    var head = convertSquareToPoint([-4.3, 7.3, -4.1, 7.5, -3.8, 6.8, -3.7, 7.7, -3.6, 7.3, -3.1, 8.1, -2.5, 8.1, -3.5, 6.5, -4.3, 7.3])
    var neck = convertSquareToPoint([-2.3, 6.5, -.4, 8.2, .2, 6.8, 1.7, 8, 3.2, 6.5, 3.5, 7.8, 4.8, 6.7, 6.3, 7, 6.2, 5.4, 7.6, 5.1, 6.8, 3.9, 7.5, 1.7]);
    var tail = convertSquareToPoint([-2.5, -6.8, -3.3, -5.8, -2.8, -7.8, -3.9, -8.5, -2.8, -8.8, -3.2, -9.8, -2, -9.1, -0.8, -10.5, .3, -10.2, .8, -11.5]);
    var head_2 = convertSquareToPoint([-3.5, 6.5, -3.6, 7.3, -2.3, 6.5, -2.5, 8.1, -.4, 8.2, -1.9, 8.3]);
    drawTriangleStrip(head, rgba);
    drawTriangleStrip(neck, rgba);
    drawTriangleStrip(tail, rgba);
    drawTriangleStrip(head_2, rgba);
    // eyes
    var circle = new Circle();
    circle.position = convertSquareToPoint([-2.5, 7.8]);
    circle.color = [1.0, 1.0, 1.0, 1.0];
    circle.size = 13;
    circle.segments = 6;
    circle.render();
    var circle = new Circle();
    circle.position = convertSquareToPoint([-2.7, 7.7]);
    circle.color = [0, 0, 0, 1.0];
    circle.size = 7;
    circle.segments = 10;
    circle.render();
}

function drawCny() {
    // draw envelope
    var env_rgba = [1, .85, 0, 1.0];
    var env_pts = convertSquareToPoint([9.3, 0, 0, 9.3, 0, -9.3, -9.3, 0]);
    var env_rgba_2 = [1, .7, 0, 1.0];
    var env_pts_2 = convertSquareToPoint([8.5, 0, 0, 8.5, 0, -8.5, -8.5, 0]);
    drawTriangleStrip(env_pts, env_rgba);
    drawTriangleStrip(env_pts_2, env_rgba_2);
    // draw left side character
    drawLeftChar();
    // draw right side character
    drawRightChar();
    drawSnake();
}