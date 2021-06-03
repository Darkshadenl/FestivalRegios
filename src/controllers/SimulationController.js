import QueueView from "../view/Canvas/QueueView";
import Queue from "../model/Queue";
import randomIntFromInterval from "../helpers/randomIntFromInterval";

export default class SimulationController {

    min_wait = 1000;
    max_wait = 2000;
    queues = [];
    view;

    people = 0;
    available_queuenr = 0;

    constructor(RegionController) {
        this.regionController = RegionController;
    }

    startSim() {
        this.disableBtns();
        this.view = new QueueView(this);
        this.queues = [new Queue(0, this), new Queue(1, this), new Queue(2, this), new Queue(3, this)];
        this.started = true;
        this.regionController.getCurrentView().changeButton(this.started);
        this.view.startSimulationDraw();
        this.startRandomPeopleSpawning();
    }

    disableBtns(){
        let regionMenu = document.getElementById('regionMenu');
        let configBtnDiv = document.getElementById('configbtnContainer');
        regionMenu.childNodes.forEach(c => c.disabled = true);
        configBtnDiv.childNodes.forEach(c => c.disabled = true);
    }

    enableBtns(){
        let regionMenu = document.getElementById('regionMenu');
        let configBtnDiv = document.getElementById('configbtnContainer');
        regionMenu.childNodes.forEach(c => c.disabled = false);
        configBtnDiv.childNodes.forEach(c => c.disabled = false);
    }

    startRandomPeopleSpawning() {
        if (!this.started) return;
        console.log("random people spawning");
        let availableQueues = this.queues.filter(q => { if (q.active) return q; })
        let randomWait = randomIntFromInterval(this.min_wait, this.max_wait);
        let randomAmountPeeps = randomIntFromInterval(1, 4);
        // queueNr = randomIntFromInterval(0, availableQueues.length - 1);
        let group = availableQueues[this.available_queuenr].addPeople(randomAmountPeeps);
        this.view.addGroup(this.available_queuenr, group);       // TODO change to random
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
        this.view.cleanup();
        this.view = null;
        this.enableBtns();
    }

    placeGroupInRegion(group){
        this.regionController.getCurrentRegion().placeGroup(group);
    }

}