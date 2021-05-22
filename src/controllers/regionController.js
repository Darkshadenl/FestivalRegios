import Festival from "../model/festival.js";
import People from "../model/people.js";
import regionView from "../view/regionView.js";

export default class regionController {
  #mainController;
  #amount_regions = 6;

  #festival;
  #current_view;
  #current_region;

  constructor(mainController) {
    this.#mainController = mainController;
    this.#festival = new Festival(this.#amount_regions);
  }

  showView(showDefault) {
    if (showDefault) {
      this.#current_region = this.#festival.getDefaultModel();
      this.#current_view = new regionView(this);
      this.#current_view.showRegion();
    } else {
      let firstTime = this.#current_region.retrieveDataFromLocalStorage();
      if (firstTime) this.UpdateLocalStorage();
      this.#current_view.showView();
    }
  }

  getRegions() {
    return this.#festival.regions;
  }

  getCurrentRegion() {
    return this.#current_region;
  }

  tickRegion(){
    //move all people?, foreach gridspot

    //for each queue
    // -> spawnPeopleOnReqion (queue.amount)

    this.spawnPeopleOnRegion(new People(3));
  }

  spawnPeopleOnRegion(people){
    let spots = this.#current_region.gridSpots;
    spots.forEach((row) => {
      row.forEach((col) => {
        if (col.trySpawnPeople(people)){
          //stops looping when a spot is found
          console.log("Placed " + people.getAmount() + " people at x: " + col.x + ", y: " + col.y);
          return;
        }
      });
    });
  }

  lockCurrentRegion() {
    this.#current_region.lockRegion();
  }

  switchToForm(regionName, regionId) {
    this.#mainController.switchToForm(regionName, regionId);
  }

  hideView() {
    this.#current_view.hideView();
  }

  switchRegion(id) {
    this.#current_region = this.#festival.getModel(id);
    let new_view = new regionView(this);
    this.#current_view.cleanForSwitchToRegion();
    this.#current_view = new_view;
    this.#current_view.showRegion();
  }

  cleanCurrentRegion() {
    this.#current_region.cleanRegion();
  }

  UpdateLocalStorage() {
    let spots = this.#current_region.gridSpots;
    let items = [];
    let festivalItemsAmounts = this.#current_region.festivalItemsAmounts;
    let id = this.#current_region.id;
    let amounts = {
      hogeBoom: festivalItemsAmounts.hogeBoom,
      bredeBoom: festivalItemsAmounts.bredeBoom,
      schaduwBoom: festivalItemsAmounts.schaduwBoom,
      Drankkraampjes: festivalItemsAmounts.drankkraampje,
      Eetkraampjes: festivalItemsAmounts.eetkraampje,
      Tenten: festivalItemsAmounts.tent,
      Toiletten: festivalItemsAmounts.toilet,
      nameRegion: this.#current_region.name,
      Prullenbakken: festivalItemsAmounts.prullenbak,
    };

    spots.forEach((row) => {
      row.forEach((col) => {
        if (!col.isAvailable()) {
          const gridItem = col.getGridItem();
          let pos = {
            x: col.x,
            y: col.y,
            type: gridItem.type,
            details: gridItem.details,
            max_visitors: gridItem.max_visitors,
            opens_at: gridItem.opens_at,
            closes_at: gridItem.closes_at,
            capacity_in_kilo: gridItem.capacity_in_kilo,
            empty_moment_in_seconds: gridItem.empty_moment_in_seconds,
            toilet_full: gridItem.toilet_full,
          };
          items.push(pos);
        }
      });
    });

    let rid = "r" + id;
    let lid = "locked" + id;
    localStorage.setItem(rid, JSON.stringify(items));
    localStorage.setItem(id, JSON.stringify(amounts));
    localStorage.setItem(
      lid,
      JSON.stringify({
        locked: this.#current_region.isLocked,
      })
    );
  }
}
