
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

function handleDrawEvent() {
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var v1 = new Vector3([document.getElementById("v1_x").value, document.getElementById("v1_y").value, 0]);
    drawVector(v1, "red");

    var v2 = new Vector3([document.getElementById("v2_x").value, document.getElementById("v2_y").value, 0]);
    drawVector(v2, "blue");
}