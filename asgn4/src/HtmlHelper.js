function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID);
        return;
    }
    htmlElm.innerHTML = text;
}

function addActionsForHtmlUI() {
    document.getElementById('animationOn').onclick = function () { g_camera = true; };
    document.getElementById('animationOff').onclick = function () { g_camera = false; };
}