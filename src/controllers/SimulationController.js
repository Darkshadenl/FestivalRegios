import QueueView from "../view/Canvas/QueueView";
import Queue from "../model/Queue";
import randomIntFromInterval from "../helpers/randomIntFromInterval";

export default class SimulationController {

    hasRun = false;
    min_wait = 1000;
    max_wait = 2000;
    queues = [];
    view;

    constructor(RegionController) {
        this.regionController = RegionController;
        this.queues = [new Queue(0, this), new Queue(1, this), new Queue(2, this), new Queue(3, this)];
    }

    startSim() {
        if (!this.hasRun) {
            this.view = new QueueView(this);
            this.hasRun = true;
        }
        this.started = true;
        this.regionController.getCurrentView().changeButton(this.started);
        this.view.startSimulationDraw();
        this.startRandomPeopleSpawning();
    }

    startRandomPeopleSpawning() {
        if (!this.started) return;
        console.log("random people spawning");
        let availableQueues = this.queues.filter(q => { if (q.active) return q; })
        let randomWait = randomIntFromInterval(this.min_wait, this.max_wait);
        let randomAmountPeeps = randomIntFromInterval(1, 4);
        let random = randomIntFromInterval(0, availableQueues.length - 1);
        let group = availableQueues[random].addPeople(randomAmountPeeps);
        this.view.addGroup(random, group);
        setTimeout(() => { this.startRandomPeopleSpawning() }, randomWait);
    }

    getModel(queueNr, modelNr) {
        if (queueNr === null) return;
        if (modelNr === null) return;
        let m;
        this.queues.forEach(q => {
            if (q.id == queueNr) {
                m = q.getGroupModel(modelNr);
            }
        });
        return m;
    }

    stopSim() {
        cancelAnimationFrame(this.view.animateId);
        this.started = false;
        this.regionController.getCurrentView().changeButton(this.started);
    }

    placeGroupInRegion(group){
        this.regionController.getCurrentRegion().placeGroup(group);
    }

}