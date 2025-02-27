class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1, 1, 1, 1];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.verts32 = new Float32Array([]);
    }
    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var d = Math.PI / 10;
        var dd = Math.PI / 10;
        //var uv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
                var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
                var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

                var uv1 = [t/Math.PI, r/(2*Math.PI)];
                var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
                var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
                var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];
                
                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p2); uv = uv.concat(uv2);
                v = v.concat(p4); uv = uv.concat(uv4);

                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                drawTriangle3DUVNormal(v,uv, v);

                v = [];
                uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p4); uv = uv.concat(uv4);
                v = v.concat(p3); uv = uv.concat(uv3);

                gl.uniform4f(u_FragColor, 1, 0, 0, 1);
                drawTriangle3DUVNormal(v,uv, v);
            }
        }

    }
    renderWShading() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // front of cube
        gl.uniform4f(u_FragColor, rgba[0] * .95, rgba[1] * .95, rgba[2] * .95, rgba[3]);
        drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);
        // // left of cube
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        drawTriangle3D([0, 0, 0, 0, 1, 0, 0, 1, 1]);
        drawTriangle3D([0, 0, 0, 0, 0, 1, 0, 1, 1]);
        // // back of cube
        gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);
        drawTriangle3D([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        drawTriangle3D([0, 0, 1, 0, 1, 1, 1, 1, 1]);

        // bottom of cube
        gl.uniform4f(u_FragColor, rgba[0] * .2, rgba[1] * .2, rgba[2] * .2, rgba[3]);
        drawTriangle3D([0, 0, 0, 0, 0, 1, 1, 0, 1]);
        drawTriangle3D([0, 0, 0, 1, 0, 1, 1, 0, 0]);
        // right of cube
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);
        drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1]);
        // top of cube
        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);
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
        uv.push(1, 0, 0, 1, 0, 0);
        vertices.push(0, 0, 0, 0, 1, 0, 1, 1, 0);
        uv.push(1, 0, 1, 1, 0, 1);
        // // left of cube
        vertices.push(0, 0, 0, 0, 1, 0, 0, 1, 1);
        uv.push(1, 0, 1, 1, 0, 1);
        vertices.push(0, 0, 0, 0, 0, 1, 0, 1, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        // // back of cube
        vertices.push(0, 0, 1, 1, 1, 1, 1, 0, 1);
        uv.push(1, 0, 0, 1, 0, 0);
        vertices.push(0, 0, 1, 0, 1, 1, 1, 1, 1);
        uv.push(1, 0, 1, 1, 0, 1);
        // bottom of cube
        vertices.push(0, 0, 0, 0, 0, 1, 1, 0, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        vertices.push(0, 0, 0, 1, 0, 1, 1, 0, 0);
        uv.push(1, 0, 0, 1, 1, 1);
        // right of cube
        vertices.push(1, 0, 0, 1, 1, 0, 1, 1, 1);
        uv.push(0, 0, 0, 1, 1, 1);
        vertices.push(1, 0, 0, 1, 0, 1, 1, 1, 1);
        uv.push(0, 0, 1, 0, 1, 1);
        // // top of cube
        vertices.push(0, 1, 0, 0, 1, 1, 1, 1, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        vertices.push(0, 1, 0, 1, 1, 1, 1, 1, 0);
        uv.push(1, 0, 0, 1, 1, 1);
        drawTriangle3DUV(vertices, uv)
    }

    // renderWShadingUVNormal() {
    //     var rgba = this.color;
    //     gl.uniform1i(u_whichTexture, this.textureNum);
    //     // Pass the color of a point to u_FragColor variable
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //     // front of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .95, rgba[1] * .95, rgba[2] * .95, rgba[3]);
    //     drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0],[1, 0, 0, 1, 0, 0],[0,0,-1,0,0,-1,0,0,-1]);
    //     drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0],[1, 0, 1, 1, 0, 1],[0,0,-1,0,0,-1,0,0,-1]);
    //     // // left of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    //     drawTriangle3D([0, 0, 0, 0, 1, 0, 0, 1, 1],[1, 0, 1, 1, 0, 1],[-1,0,0,-1,0,0,-1,0,0]);
    //     drawTriangle3D([0, 0, 0, 0, 0, 1, 0, 1, 1],[1, 0, 0, 0, 0, 1],[-1,0,0,-1,0,0,-1,0,0]);
    //     // // back of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);
    //     drawTriangle3D([0, 0, 1, 1, 1, 1, 1, 0, 1],[1, 0, 0, 1, 0, 0],[0,0,1,0,0,1,0,0,1]);
    //     drawTriangle3D([0, 0, 1, 0, 1, 1, 1, 1, 1],[1, 0, 1, 1, 0, 1],[0,0,1,0,0,1,0,0,1]);

    //     // bottom of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .2, rgba[1] * .2, rgba[2] * .2, rgba[3]);
    //     drawTriangle3D([0, 0, 0, 0, 0, 1, 1, 0, 1],[1, 0, 0, 0, 0, 1],[0,-1,0,0,-1,0,0,-1,0]);
    //     drawTriangle3D([0, 0, 0, 1, 0, 1, 1, 0, 0],[1, 0, 0, 1, 1, 1],[0,-1,0,0,-1,0,0,-1,0]);
    //     // right of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
    //     drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1],[0, 0, 0, 1, 1, 1],[1,0,0,1,0,0,1,0,0]);
    //     drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1],[0, 0, 1, 0, 1, 1],[1,0,0,1,0,0,1,0,0]);
    //     // top of cube
    //     gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
    //     drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1],[1, 0, 0, 0, 0, 1],[0,1,0,0,1,0,0,1,0]);
    //     drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0],[1, 0, 0, 1, 1, 1],[0,1,0,0,1,0,0,1,0]);
    // }
    renderFastUVNormal() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var vertices = [];
        var uv = [];
        var normals = [];
        // front of cube
        vertices.push(0, 0, 0, 1, 1, 0, 1, 0, 0);
        uv.push(1, 0, 0, 1, 0, 0);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
        vertices.push(0, 0, 0, 0, 1, 0, 1, 1, 0);
        uv.push(1, 0, 1, 1, 0, 1);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
        // // left of cube
        vertices.push(0, 0, 0, 0, 1, 0, 0, 1, 1);
        uv.push(1, 0, 1, 1, 0, 1);
        normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0);
        vertices.push(0, 0, 0, 0, 0, 1, 0, 1, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0);
        // // back of cube
        vertices.push(0, 0, 1, 1, 1, 1, 1, 0, 1);
        uv.push(1, 0, 0, 1, 0, 0);
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
        vertices.push(0, 0, 1, 0, 1, 1, 1, 1, 1);
        uv.push(1, 0, 1, 1, 0, 1);
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
        // bottom of cube
        vertices.push(0, 0, 0, 0, 0, 1, 1, 0, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
        vertices.push(0, 0, 0, 1, 0, 1, 1, 0, 0);
        uv.push(1, 0, 0, 1, 1, 1);
        normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
        // right of cube
        vertices.push(1, 0, 0, 1, 1, 0, 1, 1, 1);
        uv.push(0, 0, 0, 1, 1, 1);
        normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0);
        vertices.push(1, 0, 0, 1, 0, 1, 1, 1, 1);
        uv.push(0, 0, 1, 0, 1, 1);
        normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0);
        // // top of cube
        vertices.push(0, 1, 0, 0, 1, 1, 1, 1, 1);
        uv.push(1, 0, 0, 0, 0, 1);
        normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
        vertices.push(0, 1, 0, 1, 1, 1, 1, 1, 0);
        uv.push(1, 0, 0, 1, 1, 1);
        normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
        drawTriangle3DUVNormal(vertices, uv, normals)
    }
}
