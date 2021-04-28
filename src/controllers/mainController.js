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
        this.updateWeather(52.021520, 5.050449);
        this.switchToRegions(true);

    }

    updateWeather(lat, lon){
        this.APIController.getWeatherByLatLon(lat, lon)
        .then((response) => {
            this.drawView(response);
        });
    }

    drawView(res){
        console.log(res);
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