
// Jennie Lin, jlin216@ucsc.edu
function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // Fill a rectangle with the color

    var vec = new Vector3([2.25, 2.25, 0]);
    drawVector(vec, "red")
}

function drawVector(v, color) {
    let centerx = canvas.clientWidth / 2;
    let centery = canvas.clientHeight / 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerx, centery); // Move the pen to (30, 50)
    ctx.lineTo(centerx + 20 * v.elements[0], centery - 20 * v.elements[1]); // Draw a line to (150, 100)
    ctx.stroke(); // Render the path
}

function createVector3(x_id, y_id) {
    return new Vector3([document.getElementById(x_id).value, document.getElementById(y_id).value, 0]);
}
function handleDrawEvent() {
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var v1 = createVector3("v1_x", "v1_y");
    var v2 = createVector3("v2_x", "v2_y");
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
    var dot = Vector3.dot(v1, v2);
    return Math.acos(dot / (v1.magnitude() * v2.magnitude())) * (180 / Math.PI);
}

function areaTriangle(v1, v2) {
    var v3 = Vector3.cross(v1, v2);
    return .5 * v3.magnitude();
}

function handleDrawOperation() {
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var v1 = createVector3("v1_x", "v1_y");
    var v2 = createVector3("v2_x", "v2_y");
    drawVector(v1, "red");
    drawVector(v2, "blue");
    let operation = document.getElementById("vector-select").value;
    let scalar = document.getElementById("scalar").value;
    if (operation === "add") {
        drawVector(v1.add(v2), "green");
    }
    else if (operation === "sub") {
        drawVector(v1.sub(v2), "green");
    }
    else if (operation === "mul") {
        drawVector(v1.mul(scalar), "green");
        drawVector(v2.mul(scalar), "green");
    }
    else if (operation === "div") {
        drawVector(v1.div(scalar), "green");
        drawVector(v2.div(scalar), "green");
    }
    else if (operation === "mag") {
        console.log("Magnitude v1: " + v1.magnitude())
        console.log("Magnitude v2: " + v2.magnitude())
    }
    else if (operation === "norm") {
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
    }
    else if (operation === "angle") {
        console.log("Angle: " + angleBetween(v1, v2));
    }
    else if (operation === "area") {
        console.log("Area of the triangle: " + areaTriangle(v1, v2));
    }
}