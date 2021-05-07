import regionController from "./regionController.js";
import formController from "./formController.js";
import APIController from "./APIController.js";

export default class mainController {

    regionController;
    formController;
    APIController;

    constructor() {
        
        this.regionController = new regionController(this);
        this.formController = new formController(this);
        this.APIController = new APIController(this);
        this.switchToRegions(true);
        
        // this.APIController.update(52.021520, 5.050449);
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