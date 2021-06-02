"use strict";

import Gridspot from "../model/Gridspot";
import GridItem from "./GridItem";

export default class Region {
    id;
    name;
    openAreas = [];
    gridSpots = [];
    queues = [];
    filledSpots;        // only used to easily fill grid. Use data from this array to access gridspots
    rows = 15;
    cols = 15;
    // hasPrullenbakken = false;
    hasBredeBomen = false;
    hasSchaduwBomen = false;
    hasHogeBomen = false;
    isLocked = false;

    festivalItemsAmounts = {
        tent: 0,
        eetkraampje: 0,
        drankkraampje: 0,
        hogeBoom: 0,
        bredeBoom: 0,
        schaduwBoom: 0,
        toilet: 0,
        prullenbak: 0,
    };

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.buildGridData();
        this.retrieveDataFromLocalStorage();
    }

    buildGridData() {
        for (let y = 0; y < this.rows; y++) {
            this.gridSpots.push([]);
            for (let x = 0; x < this.cols; x++) {
                this.gridSpots[y].push(new Gridspot(x, y));
            }
        }

        // give spots neighbour data
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
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

    cleanRegion() {
        this.gridSpots = [];
        this.openAreas = [];
        this.filledSpots = null;

        this.buildGridData();
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
        this.isLocked = true;
    }

    // If filled returns the gridspot, else false.
    isFilled(col, row) {
        if (!this.gridSpots[row][col].isAvailable()) {
            return this.gridSpots[row][col];
        }
        return false;
    }

    getGridSpot(col, row) {
        return this.gridSpots[row][col];
    }

    getQueued(){
        let persons = [];
        if (this.queues != null){
            this.queues.forEach(queue => {
                persons.push(queue.getQueued());
            });
        }
        return persons;
    }

    placeElement(type, col, row, details) {
        // checks for corners and sides
        // placement in gridspots

        if (this.gridSpots[row][col].isAvailable()) {
            let newItem = new GridItem(type);
            newItem.setupDetails(details);
            let placed = this.gridSpots[row][col].addGridItem(newItem);
            if (placed) {
                return newItem.coordinates;
            } else {
                return null;
            }
        }
    }

    // return coordinates of positions to be cleaned
    removeElement(col, row) {
        let gridSpot = this.gridSpots[row][col];
        let type;
        let coordinates = gridSpot.getGridItem().coordinates;

        gridSpot.getGridItem().coordinates.forEach((coordinate) => {
            // remove griditems from gridspots
            type = this.gridSpots[coordinate["y"]][coordinate["x"]].cleanSpot();
        });

        return {coordinates, type};
    }

    retrieveDataFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem(this.id));
        if (data == null) return true;

        this.name = data["nameRegion"];
        this.festivalItemsAmounts.tent = data["Tenten"];
        this.festivalItemsAmounts.eetkraampje = data["Eetkraampjes"];
        this.festivalItemsAmounts.drankkraampje = data["Drankkraampjes"];
        // this.festivalItemsAmounts.boom = data["Bomen"];
        this.festivalItemsAmounts.hogeBoom = data["hogeBoom"];
        this.festivalItemsAmounts.bredeBoom = data["bredeBoom"];
        this.festivalItemsAmounts.schaduwBoom = data["schaduwBoom"];
        this.festivalItemsAmounts.toilet = data["Toiletten"];
        this.festivalItemsAmounts.prullenbak = data["Prullenbakken"];
        this.filledSpots = JSON.parse(localStorage.getItem("r" + this.id));

        data = JSON.parse(localStorage.getItem("locked" + this.id));

        if (data == null)
            this.isLocked = false;
        else
            this.isLocked = data["locked"];

        if (this.filledSpots == null) {
            this.placeTrees();
            // this.placePrullenbakken();
            return true;
        }

        this.filledSpots.forEach((e) => {
            const details = {
                capacity_in_kilo: e.capacity_in_kilo,
                closes_at: e.closes_at,
                details: e.details,
                empty_moment_in_seconds: e.empty_moment_in_seconds,
                max_visitors: e.max_visitors,
                opens_at: e.opens_at,
                toilet_full: e.toilet_full,
            };

            this.placeElement(e.type, e.x, e.y, details);
        });
    }

    placePrullenbakken() {
        for (let j = 0; j < this.festivalItemsAmounts.prullenbak; j++) {
            let done = false;
            while (!done) {
                let randomRow = Math.floor(Math.random() * this.rows);
                let randomCol = Math.floor(Math.random() * this.cols);
                done = this.placeElement("prullenbak", randomCol, randomRow);
            }
        }
        this.hasPrullenbakken = true;
    }

    placeTrees() {
        for (let j = 0; j < this.festivalItemsAmounts.bredeBoom; j++) {
            let done = false;
            while (!done) {
                let randomRow = Math.floor(Math.random() * this.rows);
                let randomCol = Math.floor(Math.random() * this.cols);
                done = this.placeElement("bredeBoom", randomCol, randomRow);
            }
        }
        this.hasBredeBomen = true;
        for (let j = 0; j < this.festivalItemsAmounts.hogeBoom; j++) {
            let done = false;
            while (!done) {
                let randomRow = Math.floor(Math.random() * this.rows);
                let randomCol = Math.floor(Math.random() * this.cols);
                done = this.placeElement("hogeBoom", randomCol, randomRow);
            }
        }
        this.hasHogeBomen = true;
        for (let j = 0; j < this.festivalItemsAmounts.schaduwBoom; j++) {
            let done = false;
            while (!done) {
                let randomRow = Math.floor(Math.random() * this.rows);
                let randomCol = Math.floor(Math.random() * this.cols);
                done = this.placeElement("schaduwBoom", randomCol, randomRow);
            }
        }
        this.hasSchaduwBomen = true;
    }
}
