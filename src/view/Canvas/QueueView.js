import EntryView from "./EntryView";
import GroupView from "./GroupView";

export default class QueueView {

    width = "358";
    height = "200";
    cWidth = parseInt(this.width);
    cHeight = parseInt(this.height);
    canvas;
    ctx;

    simController;

    constructor(simController) {
        this.simController = simController;
        const div = document.getElementById("canvasDiv");
        let canvas = document.createElement("canvas");
        canvas.addEventListener("click", (e) => {
            this.determineQueueClicked(e, canvas)
        })
        canvas.id = "canvas";
        canvas.setAttribute('width', this.width);
        canvas.setAttribute("height", this.height);
        canvas.setAttribute("style", "border-style: solid; border-color: black;");
        div.appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.entryPoints = [];
        this.entryPoints.push(new EntryView("30", "40", 330, 5, 1));
        this.entryPoints.push(new EntryView("30", "40", 330, 52, 2));
        this.entryPoints.push(new EntryView("30", "40", 330, 100, 3));
        this.entryPoints.push(new EntryView("30", "40", 330, 150, 4));

        this.queue_0_groups = [];
        this.queue_1_groups = [];
        this.queue_2_groups = [];
        this.queue_3_groups = [];
    }

    cleanup() {
        const div = document.getElementById("canvasDiv");
        div.childNodes.forEach(e => e.remove());
    }

    addGroup(queue, groupObject) {
        if (!groupObject) return;

        switch (queue.id) {
            case 1:
                this.queue_0_groups.push(new GroupView(groupObject));
                break;
            case 2:
                this.queue_1_groups.push(new GroupView(groupObject));
                break;
            case 3:
                this.queue_2_groups.push(new GroupView(groupObject));
                break;
            case 4:
                this.queue_3_groups.push(new GroupView(groupObject));
                break;
        }
    }

    startSimulationDraw() {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
        this.entryPoints.forEach(e => e.update(this.ctx));
        this.queue_0_groups.forEach(g => this.updateAndRefresh(1, g));
        this.queue_1_groups.forEach(g => this.updateAndRefresh(2, g));
        this.queue_2_groups.forEach(g => this.updateAndRefresh(3, g));
        this.queue_3_groups.forEach(g => this.updateAndRefresh(4, g));
        this.animateId = requestAnimationFrame(() => {
            this.startSimulationDraw()
        });
    }

    updateAndRefresh(queueId, QgroupView) {
        if (queueId == null || QgroupView == null) return;
        if (QgroupView.toBeRemoved === true) {
            this.removeFromQueue(queueId, QgroupView);
        } else {
            let model = this.simController.getModel(queueId, QgroupView.id);
            QgroupView.refreshData(model);
            QgroupView.update(this.ctx);
        }
    }

    removeFromQueue(qId, QgroupView) {
        // console.log(qId);
        let queue = this.determineQueue(qId);
        for (let i = 0; i < queue.length; i++) {
            if (!queue[i]) continue;
            let g = queue[i];
            if (g === QgroupView && g.toBeRemoved) {
                queue[i] = null;
            }
        }
    }

    determineQueue(qId) {
        switch (qId) {
            case 1:
                return this.queue_0_groups;
            case 2:
                return this.queue_1_groups;
            case 3:
                return this.queue_2_groups;
            case 4:
                return this.queue_3_groups;
        }
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


        this.entryPoints.filter(e => {
            if (e.wasIClicked(x, y, this.ctx)) {
                this.simController.disableQueue(e.id);
            }
        })
    }
}