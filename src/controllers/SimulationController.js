import QueueView from "../view/Canvas/QueueView";
import Queue from "../model/Queue";
import randomInt from "../helpers/randomInt";

export default class SimulationController {

    min_wait = 1000;
    max_wait = 3000;
    queueView;

    available_queues = 4;
    max_people = 200;
    current_amount_people = 0;
    max_groups_in_region = 100;
    groups = 0;

    constructor(RegionController) {
        this.regionController = RegionController;
    }

    startSim() {
        this.disableBtns();
        this.queueView = new QueueView(this);
        this.regionController.current_region.createQueues(this.available_queues);
        this.started = true;
        this.regionController.current_view.changeButton(this.started);
        this.queueView.startSimulationDraw();
        this.startRandomPeopleSpawing();
        this.startMovement();
        this.startSimulationUpdates();
    }

    disableBtns(){
        document.getElementById('regionMenu').childNodes.forEach(c => c.disabled = true);
        document.getElementById('configbtnContainer').childNodes.forEach(c => c.disabled = true);
    }

    enableBtns(){
        document.getElementById('regionMenu').childNodes.forEach(c => c.disabled = false);
        document.getElementById('configbtnContainer').childNodes.forEach(c => c.disabled = false);
    }

    startSimulationUpdates(){
        if (!this.started) return;
        this.regionController.updateSim();
        setTimeout(() => { this.startSimulationUpdates() }, 1000);
    }

    startRandomPeopleSpawing() {
        if (!this.started) return;

        let queueNr = randomInt(1, this.available_queues);
        let randomAmountPeeps = randomInt(1, 4);
        let queue = this.regionController.current_region.getQueue(queueNr);
        let group = null;
        if (queue)
            group = queue.addGroup(randomAmountPeeps);
        if (group)
            this.queueView.addGroup(queue, group);

        let randomWait = randomInt(this.min_wait, this.max_wait);
        setTimeout(() => { this.startRandomPeopleSpawing() }, randomWait);
    }

    startMovement(){
        if (!this.started) return;
        this.regionController.moveGroups(this.regionController.mainController.APIController.weather);
        setTimeout(() => { this.startMovement() }, 3000);
    }

    getModel(queueNr, modelNr) {
        if (queueNr === null) return;
        if (modelNr === null) return;
        let queue = this.regionController.current_region.getQueue(queueNr);
        return queue.getGroupModel(modelNr);
    }

    stopSim() {
        cancelAnimationFrame(this.queueView.animateId);
        this.started = false;
        this.queueView.cleanup();
        this.queueView = null;
        this.enableBtns();
    }

    placeGroupInRegion(group){
        let gridSpot;
        if (this.max_groups_in_region === 0 || this.groups < this.max_groups_in_region) {
            gridSpot = this.regionController.current_region.placeGroupRandomlyOnGrid(group);
            this.groups += 1;
            this.current_amount_people += group.size;
        }
        return gridSpot;
    }

}