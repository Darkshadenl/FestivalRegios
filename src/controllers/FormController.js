import FormView from "../view/FormView";

export default class FormController {

    mainController;
    current_form;

    constructor(mainController) {
        this.mainController = mainController;
    }

    showView(regionName, id) {
        this.current_form = new FormView(regionName, id);
        this.current_form.controller = this;
        this.current_form.showView();
    }

    hideView() {
        if (this.current_form)
            this.current_form.hideView();
    }

    getCurrentForm() {
        return this.current_form;
    }

    switchToRegion() {
        this.mainController.switchToRegions();
    }

    cleanAndSwitchToRegion() {
        this.mainController.cleanRegion();
        this.switchToRegion();
    }

    saveData(id, values) {
        localStorage.setItem(id, JSON.stringify(values));
        localStorage.removeItem('r' + id);
        localStorage.removeItem('locked' + id);
    }
}