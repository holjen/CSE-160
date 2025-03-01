function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID);
        return;
    }
    htmlElm.innerHTML = text;
}

const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function addActionsForHtmlUI() {
    document.getElementById('animationOn').onclick = function () { g_camera = true; };
    document.getElementById('animationOff').onclick = function () { g_camera = false; };
    document.getElementById('normalOn').onclick = function () { g_normalOn = true; };
    document.getElementById('normalOff').onclick = function () { g_normalOn = false; };
    document.getElementById('lightOn').onclick = function () { g_lightOn = true; };
    document.getElementById('lightOff').onclick = function () { g_lightOn = false; };
    document.getElementById('lightSlideX').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[0] = this.value / 100; renderScene(); } });
    document.getElementById('lightSlideY').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[1] = this.value / 100; renderScene(); } });
    document.getElementById('lightSlideZ').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[2] = this.value / 100; renderScene(); } });
    document.getElementById("color-picker").addEventListener("input", function () {
        const rgb = hexToRgb(this.value);
        g_lightColor[0] = rgb.r/255;
        g_lightColor[1] = rgb.g/255;
        g_lightColor[2] = rgb.b/255;
    })
}