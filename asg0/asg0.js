
// DrawRectangle.js
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
}