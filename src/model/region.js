"use strict";

import Gridspot from "../model/Gridspot"
import GridItem from "./GridItem";

export default class Region {

    id;
    name;
    openAreas = []
    gridSpots = []

    festivalItemsAmounts = {
        tent: 0,
        eetkraampje: 0,
        drankkraampje: 0,
        boom: 0,
        toilet: 0,
    };

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.buildGridData();
        this.retrieveDataFromLocalStorage();
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

    // return coordinates of positions to be cleaned
    removeElement(col, row){
        let gridSpot = this.gridSpots[row][col];
        let type;
        let coordinates = gridSpot.getGridItem().coordinates;

        gridSpot.getGridItem().coordinates.forEach(coordinate => {
            // remove griditems from gridspots
            type = this.gridSpots[coordinate['y']][coordinate['x']].cleanSpot();
        });

        return {coordinates, type};
    }

    retrieveDataFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem(this.id));
        if (data == null) return;
        this.name = data[0];
        this.festivalItemsAmounts.tent = data[1];
        this.festivalItemsAmounts.eetkraampje = data[2];
        this.festivalItemsAmounts.drankkraampje = data[3];
        this.festivalItemsAmounts.boom = data[4];
        this.festivalItemsAmounts.toilet = data[5];

        let filledSpots = JSON.parse(localStorage.getItem('r' + this.id));
        filledSpots.forEach(e => {
            this.placeElement(e.type, e.x, e.y);
        })
    }



}

