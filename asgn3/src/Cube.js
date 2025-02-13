class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1, 1, 1, 1];
        this.matrix = new Matrix4();
        this.textureNum=-2;
    }
    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // front of cube
        gl.uniform4f(u_FragColor, rgba[0] * .95, rgba[1] * .95, rgba[2] * .95, rgba[3]);
        drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [1,0,0,1,1,1]);
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [1,0,1,1,0,1]);
        // // left of cube
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        drawTriangle3DUV([0, 0, 0, 0, 1, 0, 0, 1, 1], [1,0,1,1,0,1]);
        drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [1,1,1,0,0,1]);
        // // back of cube
        gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);
        drawTriangle3DUV([0, 0, 1, 1, 1, 1, 1, 0, 1], [1,0,0,1,1,1]);
        drawTriangle3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [1,0,1,1,0,1]);

        // bottom of cube
        gl.uniform4f(u_FragColor, rgba[0] * .2, rgba[1] * .2, rgba[2] * .2, rgba[3]);
        drawTriangle3DUV([0,0,0 , 0,0,1, 1,0,1], [0,1,1,0,1,1]);
        drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,1,1,1,1,0]);
        // right of cube
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        drawTriangle3DUV([1, 0, 0, 1, 1, 0, 1, 1, 1],  [1,0,0,1,1,1]);
        drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1],  [1,0,0,1,1,1]);
        // top of cube
        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        drawTriangle3DUV([0,1,0 , 0,1,1, 1,1,1],  [1,0,0,1,1,1]);
        drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0],  [1,0,0,1,1,1]);
    }

    renderFastUV() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var vertices = [];  
        var uv = [];
        // front of cube
        vertices.push(0, 0, 0, 1, 1, 0, 1, 0, 0);
        uv.push(1,0,0,1,1,1);
        vertices.push(0,0,0, 0,1,0, 1,1,0);
        uv.push(1,0,1,1,0,1);
        // left of cube
        vertices.push(0, 0, 0, 0, 1, 0, 0, 1, 1);
        uv.push(1,0,1,1,0,1);
        vertices.push(0, 0, 0, 0, 0, 1, 0, 1, 1);
        uv.push(1,1,1,0,0,1);
        // back of cube
        vertices.push(0, 0, 1, 1, 1, 1, 1, 0, 1);
        uv.push(1,0,0,1,1,1);
        vertices.push(0, 0, 1, 0, 1, 1, 1, 1, 1);
        uv.push(1,0,1,1,0,1);
        // bottom of cube
        vertices.push(0,0,0 , 0,0,1, 1,0,1);
        uv.push(0,1,1,0,1,1);
        vertices.push(0,0,0, 1,0,1, 1,0,0);
        uv.push(0,1,1,1,1,0);
        // right of cube
        vertices.push(1, 0, 0, 1, 1, 0, 1, 1, 1);
        uv.push(1,0,0,1,1,1);
        vertices.push(1, 0, 0, 1, 0, 1, 1, 1, 1);
        uv.push(1,0,0,1,1,1);
        // top of cube
        vertices.push(0,1,0 , 0,1,1, 1,1,1);
        uv.push(1,0,0,1,1,1);
        vertices.push(0,1,0, 1,1,1, 1,1,0);
        uv.push(1,0,0,1,1,1);
        drawTriangle3DUV(vertices, uv)
    }
}
