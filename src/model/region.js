"use strict";

import Gridspot from "../model/Gridspot"
import GridItem from "./GridItem";

export default class Region {

    id;
    name;
    openAreas = []
    gridSpots = []

    festivalItemsAmounts = {
        tenten: 0,
        eetkraampjes: 0,
        drankkraampjes: 0,
        bomen: 0,
        toiletten: 0,
    };

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.retrieveDataFromLocalStorage();
        this.buildGridData();
    }

    buildGridData() {
        for (let y = 0; y < 15; y++) {
            this.gridSpots.push([]);
            for (let x = 0; x < 15; x++) {
                this.gridSpots[y].push(new Gridspot(x, y));
            }
        }

        // give spots neighbour data
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                let t = x;
                let r = y;
                this.gridSpots[y][x].left_spot = (typeof this.gridSpots[r][t - 1] == undefined) ? this.gridSpots[y][x].left_spot = undefined :
                    this.gridSpots[y][x].left_spot = this.gridSpots[r][t - 1];
                this.gridSpots[y][x].above_spot = (typeof this.gridSpots[r - 1][t] == undefined) ? this.gridSpots[y][x].above_spot = undefined :
                    this.gridSpots[y][x].above_spot = this.gridSpots[r - 1][t];
                this.gridSpots[y][x].bottom_spot = (typeof this.gridSpots[r + 1][t] == undefined) ? this.gridSpots[y][x].bottom_spot = undefined :
                    this.gridSpots[y][x].bottom_spot = this.gridSpots[r + 1][t];
                this.gridSpots[y][x].right_spot = (typeof this.gridSpots[r][t + 1] == undefined) ? this.gridSpots[y][x].right_spot = undefined :
                    this.gridSpots[y][x].right_spot = this.gridSpots[r][t + 1];

            }
        }
    }

    lockRegion() {
        for (let y = 0; y < this.gridSpots.length; y++) {
            this.openAreas.push([]);
            for (let x = 0; x < this.gridSpots[y].length; x++) {
                if (this.gridSpots[y][x].isAvailable()) {
                    this.openAreas[y].push(this.gridSpots[y][x]);
                }
            }
        }
    }

    placeElement(type, col, row) {

        // checks for corners and sides
        // placement in gridspots
        if (this.gridSpots[row][col].isAvailable()) {
            let newItem = new GridItem(type);
            let placed = this.gridSpots[row][col].addGridItem(newItem);

        }

    }

    retrieveDataFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem(this.id));
        if (data == null) return;
        this.name = data[0];
        this.festivalItemsAmounts.tenten = data[1];
        this.festivalItemsAmounts.eetkraampjes = data[2];
        this.festivalItemsAmounts.drankkraampjes = data[3];
        this.festivalItemsAmounts.bomen = data[4];
        this.festivalItemsAmounts.toiletten = data[5];
    }



}

