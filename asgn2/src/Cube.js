class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0, 0, 0];
        this.color = [1, 1, 1, 1];
        // this.size = 20;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // // Pass the size of the shape
        // gl.uniform1f(u_Size, size);
        // Draw
        // var delta = size / 400
        // let angleStep = 360 / this.segments;
        // for (var angle = 0; angle < 360; angle = angle + angleStep) {
        //     let centerPt = [xy[0], xy[1]];
        //     let angle1 = angle;
        //     let angle2 = angle + angleStep;
        //     let vec1 = [Math.cos(angle1 * Math.PI / 180) * delta, Math.sin(angle1 * Math.PI / 180) * delta];
        //     let vec2 = [Math.cos(angle2 * Math.PI / 180) * delta, Math.sin(angle2 * Math.PI / 180) * delta];
        //     let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        //     let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
        //     drawTriangles([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        // }
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
        drawTriangle3D([0,0,0 , 0,0,1, 1,0,1]);
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);
        // right of cube
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);
        drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1]);
        // top of cube
        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        drawTriangle3D([0,1,0 , 0,1,1, 1,1,1]);
        drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
    }
}
