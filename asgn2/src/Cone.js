class Cone {
    constructor() {
        this.type = 'cone';
        // this.position = [0, 0, 0];
        this.color = [1, 1, 1, 1];
        this.radius = 100;
        this.segments = 40;
        this.height = 1;
        this.matrix = new Matrix4();
    }
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0);
        // Pass the color of a point to u_FragColor variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // front of cube
        gl.uniform4f(u_FragColor, rgba[0] * .95, rgba[1] * .95, rgba[2] * .95, rgba[3]);
        var delta = this.radius / 400; // Radius of the cone's base
        let angleStep = 360 / this.segments;
        var color = 1.9;
        var vertices = [];
        for (var angle = 0; angle < 360; angle += angleStep) {


            // Angles for the base points
            let angle1 = angle;
            let angle2 = angle + angleStep;

            // Base circle points, y is always 0 x, z changes based on the angle
            let vec1 = [
                Math.cos(angle1 * Math.PI / 180) * delta,
                0,
                Math.sin(angle1 * Math.PI / 180) * delta
            ];
            let vec2 = [
                Math.cos(angle2 * Math.PI / 180) * delta,
                0,
                Math.sin(angle2 * Math.PI / 180) * delta
            ];
            //gl.uniform4f(u_FragColor, rgba[0] * color, rgba[1] * color, rgba[2] * color, rgba[3]);
            // drawTriangle3D([
            //     0, this.height, 0,
            //     vec1[0], vec1[1], vec1[2],
            //     vec2[0], vec2[1], vec2[2]
            // ]);
            vertices.push(0, this.height, 0,
                vec1[0], vec1[1], vec1[2],
                vec2[0], vec2[1], vec2[2]);
        }
        drawTriangle3D(vertices);
    }
}
