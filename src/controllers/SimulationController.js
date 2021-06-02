import CanvasView from "../view/Canvas/CanvasView";
import Queue from "../model/Queue";
import RegionController from "./RegionController";

export default class SimulationController {

    hasRun = false;
    regionController;


    constructor(RegionController) {
        this.regionController = RegionController;
    }

    startSim(){
        if (!this.hasRun){
            this.view = new CanvasView();
            this.queues = [new Queue(), new Queue(), new Queue(), new Queue()];
            this.hasRun = true;
        }
        this.view.startSimulationDraw();
        this.started = true;
        this.regionController.getCurrentView().changeButton(this.started);
    }

    stopSim(){
        cancelAnimationFrame(this.view.animateId);
        this.started = false;
        this.regionController.getCurrentView().changeButton(this.started);
    }


}