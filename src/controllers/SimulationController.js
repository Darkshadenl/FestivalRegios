import CanvasView from "../view/Canvas/CanvasView";
import Queue from "../model/Queue";

export default class SimulationController {

    hasRun = false;
    min_wait = 2000;
    max_wait = 4000;
    queues = [];

    constructor(RegionController) {
        this.regionController = RegionController;
        this.queues = [new Queue(0), new Queue(1), new Queue(2), new Queue(3)];
    }

    startSim() {
        if (!this.hasRun) {
            this.view = new CanvasView(this);
            this.hasRun = true;
        }
        this.started = true;
        this.regionController.getCurrentView().changeButton(this.started);
        this.view.startSimulationDraw();
        this.startRandomPeopleSpawning();
    }

    getModel(queueNr, modelNr) {
        return this.queues.filter(q => {
            if (q.id == queueNr) {
                return q.getGroupModel(modelNr);
            }
        });
    }

    startRandomPeopleSpawning() {
        // TODO: ZORG DAT MODEL LEID QUA BEWEGING VAN ENTITIES
        let availableQueues = this.queues.filter(q => { if (q.active) return q; })
        let randomWait = this.randomIntFromInterval(this.min_wait, this.max_wait);
        let randomAmountPeeps = this.randomIntFromInterval(1, 4);
        let random = this.randomIntFromInterval(0, availableQueues.length - 1);
        let group = availableQueues[random].addPeople(randomAmountPeeps);
        this.view.addGroup(random, group);
        setTimeout(() => { this.startRandomPeopleSpawning() }, randomWait);
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    stopSim() {
        cancelAnimationFrame(this.view.animateId);
        this.started = false;
        this.regionController.getCurrentView().changeButton(this.started);
    }
}