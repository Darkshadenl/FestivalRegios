import CanvasView from "../view/Canvas/CanvasView";

export default class SimulationController {

    constructor(regionController) {
        this.regionController = regionController;
    }

    startSim(){
        this.view = new CanvasView();
    }


}