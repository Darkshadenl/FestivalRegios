import EntryView from "./EntryView";
import PersonView from "./PersonView";

export default class CanvasView {

    width = "358";
    height = "200";
    cWidth = parseInt(this.width);
    cHeight = parseInt(this.height);

    constructor() {
        const div = document.getElementById("canvasDiv");
        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.setAttribute('width', this.width);
        canvas.setAttribute("height", this.height);
        canvas.setAttribute("style", "border-style: solid; border-color: black;");
        div.appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.entryPoints = [];
        this.entryPoints.push(new EntryView("30", "40", 330, 5));
        this.entryPoints.push(new EntryView("30", "40", 330, 52));
        this.entryPoints.push(new EntryView("30", "40", 330, 100));
        this.entryPoints.push(new EntryView("30", "40", 330, 150));

        this.people = [];
        this.people.push(new PersonView(10, 5));
        this.people.push(new PersonView(10, 50));
        this.people.push(new PersonView(10, 90));
        this.people.push(new PersonView(10, 140));

    }

    addPerson(queueNr){
        switch (queueNr) {
            case 0:
                this.people.push(new PersonView(10, 5));
                break;
            case 1:
                this.people.push(new PersonView(10, 50));
                break;
            case 3:
                this.people.push(new PersonView(10, 90));
                break;
            case 4:
                this.people.push(new PersonView(10, 140));
                break;
        }
    }

    startSimulationDraw(){
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
        this.entryPoints.forEach(e => e.update(this.ctx));
        this.people.forEach(p => p.update(this.ctx));
        this.animateId = requestAnimationFrame(() => { this.startSimulationDraw() });
    }


}