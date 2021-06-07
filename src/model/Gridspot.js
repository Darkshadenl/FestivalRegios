"use strict";

import randomInt from "../helpers/randomInt";

export default class Gridspot {

    x;
    y;
    peopleAmount;
    max_peopleAmount = 7;
    gridItem = null;
    simulationItems = [];
    available = true;
    available_for_groups = true;
    position;

    left_spot = null;
    right_spot = null;
    above_spot = null;
    bottom_spot = null;

    // y = row, col = x
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = 'x: ' + x + ' y:' + y;

        Array.prototype.actual_length = () => { return Object.keys(this).length }
    }

    // returns type of deleted item
    cleanSpot() {
        let type = this.gridItem.type;
        this.gridItem = null;
        this.available = true;
        return type;
    }

    moveGroupsRandomly(){
        console.log('moving groups');
        if (this.simulationItems.actual_length === 0) return;
        this.simulationItems.forEach(group => {
            let shouldMove = group.shouldIMove();
            shouldMove = true; // TODO remove
            if (shouldMove) {
                let randomGridSpotNeighbour = this.getRandomNeighbour();
                console.log(`Current pos: x:${this.x} y:${this.y}`);
                console.log(`Random neighbour: x:${randomGridSpotNeighbour.x} y:${randomGridSpotNeighbour.y}`);
                let moved = false;
                let count = 0;
                while (!moved) {
                    moved = randomGridSpotNeighbour.addGroup(group);

                    if (moved){
                        console.log(`Moved! ${this.x} ${this.y}`);
                        this.removeSimulationItem(group);
                        moved = true;
                    }
                    count += 1;
                    if (count === 5)
                        moved = true;
                }
            }
        })
        // return null;
    }

    getRandomNeighbour(){
        const neighBours = [this.left_spot, this.right_spot, this.above_spot, this.bottom_spot];
        let chosen = false;
        while (!chosen) {
            let random = randomInt(0, neighBours.length);
            if (neighBours[random] != null){
                chosen = neighBours[random];
            }
        }
        return chosen;
    }

    getGridItem() {
        return this.gridItem;
    }

    isAvailable() {
        return this.available;
    }

    isAvailableForGroups(){
        return this.available_for_groups;
    }

    addGroup(group){
        if (this.isAvailableForGroups()) {
            const fits = this.checkIfNewGroupFits(group);
            if (fits){
                if (group.id === 1) {
                    console.log(`Found new gridspot for group 1.`);
                }
                this.simulationItems.push(group);
                group.setGridSpot(this);
                if (this.getCountPeople() >= this.max_peopleAmount) {
                    this.available_for_groups = false;
                }
                return true;
            }
        } else {
            return this.isAvailableForGroups();
        }
    }

    checkIfNewGroupFits(item){
        return this.getCountPeople() + item.size <= 7;
    }

    removeSimulationItem(s){
        for (let i = 0; i < Object.keys(this.simulationItems).length; i++) {
            if (this.simulationItems[i] === s) {
                this.simulationItems.splice(i, 1);
            }
        }
    }

    getCountPeople(){
        let size = 0;
        this.simulationItems.forEach(e => {
            size += e.size;
        })
        return size;
    }

    cleanSimulation(){
        this.simulationItems = [];
        this.available = true;
    }

    /// return true if placed succesfully.
    /// else false
    addGridItem(item) {
        if (this.isAvailable()) {
            let width = item.width;
            let height = item.height;

            // check if it can be placed. Whichever point of the item you're dragging doesn't matter. It always calculates from the left upper point. 
            let canBePlaced = this.canItemBePlaced(width, height);

            if (canBePlaced) {
                this.placeItem(width, height, item);
                return true;
            } else {
                return false;
            }
        } else {
            return this.isAvailable();
        }
    }

    // always check if item can be placed before doing this
    placeItem(width, height, item) {
        if (width == 0) {
            return;
        }
        if (this.right_spot != null || this.right_spot != undefined) {
            this.right_spot.placeItem(width - 1, height, item);
        }
        if (this.bottom_spot != null || this.bottom_spot != undefined) {
            this.bottom_spot.placeItemBottom(height - 1, item);
        }
        this.gridItem = item;
        this.available = false;
        item.coordinates.push(this);
    }

    placeItemBottom(height, item) {
        if (height == 0) {
            return;
        }
        if (this.bottom_spot != null || this.bottom_spot != undefined) {
            this.bottom_spot.placeItemBottom(height - 1, item);
        }
        this.gridItem = item;
        this.available = false;
        item.coordinates.push(this);
    }

    // return true if item can be placed
    canItemBePlaced(width, height) {
        if (width == 0) {
            return true;
        }
        let free_spot = -1;
        let free_bottom_spot = -1;

        if (this.right_spot != null) {
            free_spot = this.right_spot.canItemBePlaced(width - 1, height);
            free_bottom_spot = this.isBottomFreeSpot(height);
        }

        if (width == 1 && this.right_spot == null) {
            free_spot = true
            free_bottom_spot = true;
        }

        if (free_spot == true && free_bottom_spot == true) {
            if (this.isAvailable()) {
                return true;
            }
        }
        return false;

    }

    isBottomFreeSpot(height) {
        if (height == 0) {
            return true;
        }

        let free_bottom_spot = -1;

        if (this.bottom_spot != null) {
            free_bottom_spot = this.bottom_spot.isBottomFreeSpot(height - 1);
        }

        if (height == 1 && this.bottom_spot == null) {
            free_bottom_spot = true
        }

        if (free_bottom_spot == true) {
            if (this.isAvailable()) {
                return true;
            }
        }
        return false;
    }

}