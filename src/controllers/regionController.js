import regionView from "../view/regionView.js";
import mainController from "./mainController.js";

export default class regionController {
  mainController;
  viewsAvailable = [];

  constructor(mainController) {
    this.mainController = mainController;
    this.viewsAvailable.push(
      new regionView("Regio 1"),
      new regionView("Regio 2"),
      new regionView("Regio 3"),
      new regionView("Regio 4"),
      new regionView("Regio 5"),
      new regionView("Regio 6")
    );
    this.viewsAvailable.forEach((e) => {
      e.regions = this.viewsAvailable;
      e.controller = this;
    });
  }

  hideView() {
      this.viewsAvailable.forEach(e => {
          if (e.active){
              e.hideRegionView()
          }
      })
  }

  showView(regionName) {
    if (regionName == "default") {
      this.viewsAvailable[0].showRegion();
    }
    if (regionName == undefined) {
      console.log("undefined view");
    } else {
    }
  }
}
