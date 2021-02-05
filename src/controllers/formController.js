import formView from "../view/formView";

export default class formController {

    mainController;
    viewsAvailable = [];

    constructor(mainController){
        this.mainController = mainController;
        this.viewsAvailable.push(
            new formView('Regio 1'),
            new formView('Regio 2'),
            new formView('Regio 3'),
            new formView('Regio 4'),
            new formView('Regio 5'),
            new formView('Regio 6'),
        )
        this.viewsAvailable.forEach(e => {
            e.controller = this;
        })
    }

    showView(formName){
        this.viewsAvailable.forEach(e => {
            if (e.name == formName){
                e.showView();
            }
        })
    }

    hideView(){
        this.viewsAvailable.forEach(e => {
            if (e.active){
                e.hideView();
            }
        })
    }

    

}