import regionController from "./regionController.js";
import formController from "./formController.js";
import APIController from "./APIController.js";
import Queue from "../model/queue.js";

export default class mainController {

    regionController;
    formController;
    APIController;

    constructor() {
        
        this.regionController = new regionController(this);
        this.formController = new formController(this);
        this.APIController = new APIController(this);
        this.switchToRegions(true);
        this.queueTest()
    }

    queueTest(){
        var queue = new Queue(2);
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
        console.log('waiting: ' + queue.getAmountInQueue());
        console.log('output: ' + queue.getQueued());
    }

    switchToRegions(showDefault) {
        this.formController.hideView();
        if (showDefault) {
            this.regionController.showView(true);
        } else {
            this.regionController.showView();
        }
    }

    cleanRegion() {
        this.regionController.cleanCurrentRegion();
    }

    switchToForm(regionName, id) {
        this.regionController.hideView();
        this.formController.showView(regionName, id);
    }
}