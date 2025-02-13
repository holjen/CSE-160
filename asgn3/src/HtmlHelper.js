function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID);
        return;
    }
    htmlElm.innerHTML = text;
}

function addActionsForHtmlUI() {
    document.getElementById('Cam').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderScene(); });
    document.getElementById('MainWing').addEventListener('mousemove', function () { g_mainWingAngle = this.value; renderScene(); });
    document.getElementById('MidWing').addEventListener('mousemove', function () { g_midWingAngle = this.value; renderScene(); });
    document.getElementById('TipWing').addEventListener('mousemove', function () { g_tipWingAngle = this.value; renderScene(); });
    document.getElementById('animationOn').onclick = function () { g_animation = true; };
    document.getElementById('animationOff').onclick = function () { g_animation = false; };
}