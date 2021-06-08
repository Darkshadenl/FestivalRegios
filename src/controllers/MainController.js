import RegionController from "./RegionController.js";
import FormController from "./FormController.js";
import APIController from "./APIController.js";

export default class mainController {

    #regionController;
    #formController;
    #APIController;

    constructor() {
        
        this.regionController = new RegionController(this);
        this.formController = new FormController(this);
        this.APIController = new APIController(this);
        this.switchToRegions(true);
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


    get regionController() {
        return this.#regionController;
    }

    set regionController(value) {
        this.#regionController = value;
    }

    get formController() {
        return this.#formController;
    }

    set formController(value) {
        this.#formController = value;
    }

    get APIController() {
        return this._APIController;
    }

    set APIController(value) {
        this._APIController = value;
    }
}