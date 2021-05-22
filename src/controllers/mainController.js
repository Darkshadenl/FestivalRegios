import regionController from "./regionController.js";
import formController from "./formController.js";
import APIController from "./APIController.js";
import Queue from "../model/queue.js";
import Gridspot from "../model/Gridspot"; //todo remove (testing)
import People from "../model/people"; //todo remove (testing)


export default class mainController {

    regionController;
    formController;
    APIController;

    constructor() {
        
        this.regionController = new regionController(this);
        this.formController = new formController(this);
        this.APIController = new APIController(this);
        this.switchToRegions(true);
        // this.queueTest()
        this.gridspotTest();
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

    gridspotTest(){
        let spot = new Gridspot(2, 2);
        console.log("Gridspot x: " + spot.x + ", y: " + spot.y + ", people: " + spot.getTotalPeople());
        
        console.log("trying to spawning 3 people, succes: " + spot.trySpawnPeople(new People(3)));
        console.log("Gridspot x: " + spot.x + ", y: " + spot.y + ", people: " + spot.getTotalPeople());

        console.log("trying to spawning 4 people, succes: " + spot.trySpawnPeople(new People(4)));
        console.log("Gridspot x: " + spot.x + ", y: " + spot.y + ", people: " + spot.getTotalPeople());

        console.log("trying to spawning 1 people, succes: " + spot.trySpawnPeople(new People(1)));
        console.log("Gridspot x: " + spot.x + ", y: " + spot.y + ", people: " + spot.getTotalPeople());


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