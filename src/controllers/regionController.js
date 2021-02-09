import Festival from "../model/festival.js";
import regionView from "../view/regionView.js";
import mainController from "./mainController.js";

export default class regionController {
  mainController;
  amount_regions = 6

  festival;
  current_view;

  constructor(mainController) {
    this.mainController = mainController;
    this.festival = new Festival(6);   
  }

  showView(id) {
    if (id == "default" || id == undefined) {
      this.current_view = new regionView(this.festival.getDefaultModel(), this);
      this.current_view.showRegion();
    } else { 
      this.current_view.showView();
    }
  }

  hideView() {
      this.current_view.hideView();
  }

  switchRegion(id) {   
    let new_view = new regionView(this.festival.getModel(id), this);
    this.current_view.cleanForSwitchToRegion();
    this.current_view = new_view;
    this.current_view.showRegion();
  }

}
