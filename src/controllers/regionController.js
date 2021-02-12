import Festival from "../model/festival.js";
import regionView from "../view/regionView.js";
import mainController from "./mainController.js";

export default class regionController {
  mainController;
  amount_regions = 6;

  festival;
  current_view;
  current_region;

  constructor(mainController) {
    this.mainController = mainController;
    this.festival = new Festival(this.amount_regions);
  }

  showView(showDefault) {
    if (showDefault) {
      this.current_region = this.festival.getDefaultModel();
      this.current_view = new regionView(this);
      this.current_view.showRegion();
    } else { 
      this.current_region.retrieveDataFromLocalStorage();
      this.current_view.showView();
    }
  }

  hideView() {
      this.current_view.hideView();
  }

  switchRegion(id) {   
    this.current_region = this.festival.getModel(id);
    let new_view = new regionView(this);
    this.current_view.cleanForSwitchToRegion();
    this.current_view = new_view;
    this.current_view.showRegion();
  }

  UpdateLocalStorage(){
    let spots = this.current_region.gridSpots;
    let items = [];

    spots.forEach(row => {
      row.forEach(col => {
        if (!col.isAvailable()){
          let pos = { 'x': col.x, 'y': col.y, 'type': col.getGridItem().type };
          items.push(pos);
        }
      });
    })

    items.push(this.current_region.festivalItemsAmounts);

    let id = 'r' + this.current_region.id;
    localStorage.setItem(id, JSON.stringify(items))
  }
}
