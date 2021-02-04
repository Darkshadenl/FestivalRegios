import regionController from "./regionController.js";
import formController from "./formController.js";

export default class mainController {

    regionController;
    formController;

    constructor() {
        this.regionController = new regionController(this);
        this.formController = new formController(this);
        this.switchToRegions();
    }

    switchToRegions(regionName) {
        // this.#formController.hideView();
        if (regionName == undefined){
            this.regionController.showView("default");
        } else {
            this.regionController.showView(regionName);
        }
    }

    switchToForm(regionName) {          
        this.regionController.hideView();
        this.formController.showView(regionName);
    }
}