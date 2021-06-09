import Festival from "../model/Festival.js";
import regionView from "../view/regionView.js";
import SimulationController from "./SimulationController";
import Weather from "../enums/weather";
import {verbose} from "../helpers/logger";
import {isArray} from "underscore";

export default class RegionController {
    #mainController;
    amount_regions = 6;

    #festival;
    #current_view;
    #current_region;

    #simulationController;
    #moved_groups = [];

    constructor(mainController) {
        this.festival = new Festival(this.amount_regions, this);
        this.mainController = mainController;
    }

    showView(showDefault) {
        if (showDefault) {
            this.current_region = this.festival.getDefaultModel();
            this.current_view = new regionView(this);
            this.current_view.showRegion();
        } else {
            let firstTime = this.current_region.retrieveDataFromLocalStorage();
            if (firstTime) this.UpdateLocalStorage();
            this.current_view.showView();
        }
    }

    startSim() {   // TODO simulationController should be linked to region.
        if (this.simulationController == null) {
            this.simulationController = new SimulationController(this);
        }
        this.simulationController.startSim(this);
    }

    resetSim(){
        this.simulationController.stopSim();
        this.current_view.changeButton(false);
        // this.cleanGroupsFromGrid();
        this.simulationController = null;

    }

    cleanGroupsFromGrid() {
        const spots = this.current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                this.current_view.cleanupSimItem(spots[i][j]);
                spots[i][j].resetSpotForSim();
            }
        }
    }

    updateSim() {
        const spots = this.current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                this.current_view.updateSim(spots[i][j]);
                if (spots[i][j].should_flash){
                    this.#moved_groups.push(spots[i][j]);
                    spots[i][j].should_flash = false;
                }
                this.flashView(this.#moved_groups);
                this.#moved_groups = [];
            }
        }
    }

    moveGroups(weather) {
        const spots = this.current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                if (spots[i][j].simulationItems.actual_length() === 0) continue;
                switch (weather) {
                    case Weather.NONE:
                        this.#moved_groups.push(spots[i][j].moveGroupsRandomly());
                        break;
                    case Weather.REGEN:
                        if (!this.tentPosses)
                            this.tentPosses = this.current_region.getTentPositions();
                        this.#moved_groups.push(spots[i][j].moveGroupsRain(this.tentPosses));
                        break;
                    case Weather.HELDER:
                        // this.#moved_groups.push(spots[i][j].moveGroupsClear());
                        break;
                    default:
                        this.#moved_groups.push(spots[i][j].moveGroupsRandomly());
                        break;
                }
            }
        }
    }

    flashView(movedGroups){
        movedGroups.forEach(a => {
            if (isArray(a)){
                a.forEach(group => {
                    if (group.gridItem){
                        verbose('Griditem! Flash!');
                        group.gridItem.coordinates.forEach(c => this.current_view.flash(c, true));
                    } else {
                        this.current_view.flash(group.current_gridSpot);
                    }
                });
            } else {
                if (a){
                    // A is gridSpot
                    if (a.gridItem){
                        verbose('Griditem! Flash!');
                        a.gridItem.coordinates.forEach(c => this.current_view.flash(c, true));
                    } else {
                        this.current_view.flash(a);
                    }
                }
            }
        });
    }

    get regions() {
        return this.festival.regions;
    }

    lockCurrentRegion() {
        this.current_region.lockRegion();
    }

    switchToForm(regionName, regionId) {
        this.mainController.switchToForm(regionName, regionId);
    }

    hideView() {
        this.current_view.hideView();
    }

    switchRegion(id) {
        this.current_region = this.festival.getModel(id);
        let new_view = new regionView(this);
        this.current_view.cleanForSwitchToRegion();
        this.current_view = new_view;
        this.simulationController = null;
        this.current_view.showRegion();
    }

    cleanCurrentRegion() {
        this.current_region.cleanRegion();
    }

    UpdateLocalStorage() {
        let spots = this.current_region.gridSpots;
        let items = [];
        let festivalItemsAmounts = this.current_region.festivalItemsAmounts;
        let id = this.current_region.id;
        let amounts = {
            hogeBoom: festivalItemsAmounts.hogeBoom,
            bredeBoom: festivalItemsAmounts.bredeBoom,
            schaduwBoom: festivalItemsAmounts.schaduwBoom,
            Drankkraampjes: festivalItemsAmounts.drankkraampje,
            Eetkraampjes: festivalItemsAmounts.eetkraampje,
            Tenten: festivalItemsAmounts.tent,
            Toiletten: festivalItemsAmounts.toilet,
            nameRegion: this.current_region.name,
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
                locked: this.current_region.isLocked,
            })
        );
    }


    set current_view(value) {
        this.#current_view = value;
    }

    get current_view() {
        return this.#current_view;
    }

    get current_region() {
        return this.#current_region;
    }

    set current_region(value) {
        this.#current_region = value;
    }

    get simulationController() {
        return this.#simulationController;
    }

    set simulationController(value) {
        this.#simulationController = value;
    }

    get festival() {
        return this.#festival;
    }

    set festival(value) {
        this.#festival = value;
    }


    get mainController() {
        return this.#mainController;
    }


    set mainController(value) {
        this.#mainController = value;
    }
}
