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

    switchToRegions(id) {
        this.formController.hideView();
        if (id == undefined){
            this.regionController.showView();
        } else {
            this.regionController.showView(id);
        }
    }

    switchToForm(regionName, id) {          
        this.regionController.hideView();
        this.formController.showView(regionName, id);
    }
}