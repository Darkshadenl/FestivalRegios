import formView from "../view/formView";

export default class formController {

    mainController;
    current_form;

    constructor(mainController){
        this.mainController = mainController;
    }

    showView(regionName, id){
        this.current_form = new formView(regionName, id);
        this.current_form.controller = this;
        this.current_form.showView();
    }

    hideView(){
        if (this.current_form)
            this.current_form.hideView();
    }

    saveData(id, values){
        localStorage.setItem(id, JSON.stringify(values))
    }
}