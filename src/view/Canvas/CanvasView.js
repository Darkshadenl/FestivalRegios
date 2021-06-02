import EntryView from "./EntryView";
import GroupView from "./GroupView";
import queueCoordinates from "../../enums/queueCanvasCoordinates";

export default class CanvasView {

    width = "358";
    height = "200";
    cWidth = parseInt(this.width);
    cHeight = parseInt(this.height);
    canvas;
    ctx;

    #simController;

    constructor(simController) {
        this.#simController = simController;
        const div = document.getElementById("canvasDiv");
        let canvas = document.createElement("canvas");
        canvas.addEventListener("click", (e) => { this.determineQueueClicked(e, canvas) })
        canvas.id = "canvas";
        canvas.setAttribute('width', this.width);
        canvas.setAttribute("height", this.height);
        canvas.setAttribute("style", "border-style: solid; border-color: black;");
        div.appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.entryPoints = [];
        this.entryPoints.push(new EntryView("30", "40", 330, 5, "red"));
        this.entryPoints.push(new EntryView("30", "40", 330, 52, "blue"));
        this.entryPoints.push(new EntryView("30", "40", 330, 100, "green"));
        this.entryPoints.push(new EntryView("30", "40", 330, 150, "brown"));

        this.queue_1_groups = [];
        this.queue_2_groups = [];
        this.queue_3_groups = [];
        this.queue_4_groups = [];
    }

    addGroup(queueNr, groupObject){
        switch (queueNr) {
            case 0:
                this.queue_1_groups.push(new GroupView(groupObject));
                break;
            case 1:
                this.queue_2_groups.push(new GroupView(groupObject));
                break;
            case 2:
                this.queue_3_groups.push(new GroupView(groupObject));
                break;
            case 3:
                this.queue_4_groups.push(new GroupView(groupObject));
                break;
        }
    }

    startSimulationDraw(){
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
        this.entryPoints.forEach(e => e.update(this.ctx));
        this.queue_1_groups.forEach(g => this.updateAndRefresh(1, g));
        this.queue_2_groups.forEach(g => this.updateAndRefresh(1, g));
        this.queue_3_groups.forEach(g => this.updateAndRefresh(1, g));
        this.queue_4_groups.forEach(g => this.updateAndRefresh(1, g));
        this.animateId = requestAnimationFrame(() => { this.startSimulationDraw() });
    }

    updateAndRefresh(queueId, g){
        g.refreshData(this.#simController.getModel(1, g.id()))
        g.update(this.ctx);
    }

    determineQueueClicked(event, canvas) {
        let rect = canvas.getBoundingClientRect();
        let coordinates = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        console.log("Coordinate x: " + x,
            "Coordinate y: " + y);

        let clicked = this.entryPoints.filter(e => {
            if (e.wasIClicked(x, y, this.ctx)){
                return e;
            }
        })

    }
}