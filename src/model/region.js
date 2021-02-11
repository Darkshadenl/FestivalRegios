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
                try {
                    this.gridSpots[y][x].left_spot = this.gridSpots[y][x - 1];
                } catch (error) {
                    this.gridSpots[y][x].left_spot = null;
                }
                try {
                    this.gridSpots[y][x].above_spot = this.gridSpots[y - 1][x];
                } catch (error) {
                    this.gridSpots[y][x].above_spot = null;
                }
                try {
                    this.gridSpots[y][x].right_spot = this.gridSpots[y][x + 1];
                } catch (error) {
                    this.gridSpots[y][x].right_spot = null;
                }
                try {
                    this.gridSpots[y][x].bottom_spot = this.gridSpots[y + 1][x];
                } catch (error) {
                    this.gridSpots[y][x].bottom_spot = null;
                }

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
            if (placed){
                return newItem.coordinates;
            } else {
                return null;
            }
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

