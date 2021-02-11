import regionController from "./regionController.js";
import formController from "./formController.js";

export default class mainController {

    regionController;
    formController;

    constructor() {
        this.regionController = new regionController(this);
        this.formController = new formController(this);
        this.switchToRegions(true);
    }

    switchToRegions(showDefault) {
        this.formController.hideView();
        if (showDefault){
            this.regionController.showView(true);
        } else {
            this.regionController.showView();
        }
    }

    switchToForm(regionName, id) {          
        this.regionController.hideView();
        this.formController.showView(regionName, id);
    }
}