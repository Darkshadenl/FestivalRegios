import Festival from "../model/Festival.js";
import regionView from "../view/regionView.js";
import SimulationController from "./SimulationController";
import Weather from "../enums/weather";
import {superVerbose, verbose} from "../helpers/logger";
import {first, forEach, isArray, pluck} from "underscore";

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
            this.current_region = this.#festival.getDefaultModel();
            this.current_view = new regionView(this);
            this.#current_view.showRegion();
        } else {
            let firstTime = this.#current_region.retrieveDataFromLocalStorage();
            if (firstTime) this.UpdateLocalStorage();
            this.#current_view.showView();
        }
    }

    startSim() {
        if (this.simulationController == null) {
            this.simulationController = new SimulationController(this);
        }
        this.simulationController.startSim(this);
    }

    resetSim(){
        this.simulationController.stopSim();
        this.#current_view.changeButton(false);
        this.cleanGroupsFromGrid();
        this.simulationController = null;
    }

    changeButton(started){
        this.#current_view.changeButton(started);
    }

    activeQueues(){
        return this.#current_region.queues.filter(q => q.active);
    }

    cleanGroupsFromGrid() {
        const spots = this.#current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                this.#current_view.cleanupSimItem(spots[i][j]);
                spots[i][j].resetSpotForSim();
            }
        }
    }

    createPieces() {
        for (let x in this.#current_region.festivalItemsAmounts) {
            this.#current_view.createPiece(x);
        }
    }

    updateSim() {
        const spots = this.#current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                this.#current_view.updateSim(spots[i][j]);
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
       this.determineGridItemPositionsOnce();
        const spots = this.#current_region.gridSpots;
        for (let i = 0; i < spots.length; i++) {
            for (let j = 0; j < spots[i].length; j++) {
                if (spots[i][j].simulationItems.actual_length() === 0) continue;
                switch (weather) {
                    case Weather.NONE:
                        this.#moved_groups.push(spots[i][j].moveGroupsRandomly());
                        break;
                    case Weather.REGEN:
                        this.#moved_groups.push(spots[i][j].moveGroups(this.tentPosses, Weather.REGEN));
                        break;
                    case Weather.HELDER:
                        this.#moved_groups.push(spots[i][j].moveGroups(this.threePosses, Weather.HELDER));
                        break;
                    default:
                        this.#moved_groups.push(spots[i][j].moveGroupsRandomly());
                        break;
                }
            }
        }
    }

    determineGridItemPositionsOnce(){
        if (!this.tentPosses && !this.threePosses){
            this.tentPosses = this.#current_region.getPositions(["tent"]);
            this.threePosses = this.#current_region.getPositions(["hogeBoom", "bredeBoom", "schaduwBoom"]);
            verbose({threes: this.threePosses, tents: this.tentPosses});
        }
    }

    flashView(movedGroups){
        movedGroups.forEach(a => {
            if (isArray(a)){
                a.forEach(group => {
                    if (group.gridItem){
                        group.gridItem.coordinates.forEach(c => this.#current_view.flash(c, true));
                    } else {
                        this.#current_view.flash(group.current_gridSpot);
                    }
                });
            } else {
                if (a){
                    // A is gridSpot
                    if (a.gridItem){
                        a.gridItem.coordinates.forEach(c => this.#current_view.flash(c, true));
                    } else {
                        this.#current_view.flash(a);
                    }
                }
            }
        });
    }

    getRegionNames(){
        return pluck(this.#festival.regions, 'name');
    }

    placeElementInRegion(id, col, row){
        return this.#current_region.placeElement(id, col, row);
    }

    lockCurrentRegion() {
        this.#current_region.lockRegion();
    }

    switchToForm(regionName, regionId) {
        this.mainController.switchToForm(regionName, regionId);
    }

    hideView() {
        this.#current_view.hideView();
    }

    switchRegion(id) {
        this.current_region = this.#festival.getModel(id);
        let new_view = new regionView(this);
        this.#current_view.cleanForSwitchToRegion();
        this.current_view = new_view;
        this.simulationController = null;
        this.#current_view.showRegion();
    }

    createQueues(amount_qs){
        this.#current_region.createQueues(amount_qs);
    }

    getQueue(id){
        return this.#current_region.getQueue(id);
    }

    placeGroupROnGrid(group){
        return this.#current_region.placeGroupRandomlyOnGrid(group);
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

    disableQueue(id){
        let q = this.#current_region.queues.filter(q => q.id === id);
        forEach(q, q => q.active = q.active === false ? q.active = true : q.active = false);
    }

    getGridSpot(col, row){
        return this.#current_region.getGridSpot(col, row);
    }

    getCurrentRegionFestivalItemAmount(id){
        return this.#current_region.festivalItemsAmounts[id];
    }

    setCurrentRegionFestivalItemAmount(id, value){
        this.#current_region.festivalItemsAmounts[id] = value;
    }

    removeElementFromRegion(col, row){
        return this.#current_region.removeElement(col, row);
    }

    getRegionByName(name){
        return first(this.#festival.regions.filter(e => e.name === name));
    }

    getCurrentRegionName(){
        return this.#current_region.name;
    }

    getCurrentRegionId(){
        return this.#current_region.id;
    }

    set current_view(value) {
        this.#current_view = value;
    }

    getCurrentRegionGridSpots(){
        return this.#current_region.gridSpots;
    }

    isCurrentRegionLocked(){
        return this.#current_region.isLocked;
    }

    isCurrentRegionFilled(col, row){
        return this.#current_region.isFilled(col, row);
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
