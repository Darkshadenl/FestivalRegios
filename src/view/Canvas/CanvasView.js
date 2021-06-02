export default class CanvasView {

    constructor() {
        const div = document.getElementById("canvasDiv");
        const canvas = document.createElement("canvas");
        canvas.setAttribute('width', 200);
        canvas.setAttribute("height", 200);
        canvas.setAttribute("style", "border-style: solid; border-color: black;");
        div.appendChild(canvas);
    }


}