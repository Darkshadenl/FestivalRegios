import randomInt from "../helpers/randomInt";
import {contains, first, forEach} from "underscore";
import log, {superVerbose, verbose} from "../helpers/logger";
import PathFinding from "../helpers/PathFinding";

export default class Gridspot {

    x;
    y;
    peopleAmount = 0;
    max_peopleAmount = 7;
    gridItem = null;
    simulationItems = [];
    available = true;
    #available_for_groups = true;
    not_available_types = ["prullenbak", "eetkraampje", "drankkraampje", "hogeBoom", "bredeBoom", "schaduwBoom"];
    position;

    left_spot = null;
    right_spot = null;
    above_spot = null;
    bottom_spot = null;

    should_flash = false;
    target_spot = null;

    hCost = 0;
    gCost = 0;
    parent;

    // y = row, col = x
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = 'x: ' + x + ' y:' + y;

        Array.prototype.actual_length = function () {
            return Object.keys(this).length
        }
    }

    resetSpotForSim() {
        this.available_for_groups = true;
        this.simulationItems = [];
        this.peopleAmount = 0;
        if (this.gridItem)
            this.gridItem.resetGridItem();
    }

    // returns type of deleted item
    cleanSpot() {
        let type = this.gridItem.type;
        this.gridItem = null;
        this.available = true;
        return type;
    }

    moveGroupsRandomly() {
        if (this.simulationItems.actual_length === 0) return;
        const moved_groups = [];
        this.simulationItems.forEach(group => {
            let shouldMove = group.shouldIMove();
            if (shouldMove) {
                let randomGridSpotNeighbour = this.getRandomNeighbour();
                let moved = false;
                let count = 0;
                while (!moved) {
                    moved = randomGridSpotNeighbour.addGroup(group);

                    if (moved) {
                        this.removeSimulationItem(group);
                        this.should_flash = false;
                        moved_groups.push(group);
                        moved = true;
                    }
                    count += 1;
                    if (count === 5)
                        moved = true;
                }
            }
        })
        return moved_groups;
    }

    moveGroups(positions, weatherType) {
        if (this.simulationItems.actual_length === 0) return;
        const moved_groups = [];
        this.simulationItems.forEach(group => {
            let shouldMove = group.shouldIMove(weatherType);
            if (shouldMove) {
                let moved = false;
                if (!group.path) {
                    group.target_spot = this.determineClosestGridItem(positions);
                    group.path = PathFinding(this, group.target_spot);
                }

                if (group.path && group.path.length > 0) {
                    let spot = group.path.pop();
                    moved = spot.addGroup(group);
                    if (moved) {
                        console.log('Moved');
                        this.removeSimulationItem(group);
                        this.should_flash = false;
                        moved_groups.push(group);
                    }
                }
            }
        })
        return moved_groups;
    }

    determineClosestGridItem(posses) {
        if (this.target_spot) return;
        // check all objects.
        // select closest one.
        // We'll only check the x val.

        const diff = (a, b) => Math.abs(a - b);
        const x = this.x;
        let targetSpot = null;
        let dist_target_this = 0;

        for (let a = 0; a < posses.length; a++) {
            for (let t = 0; t < posses[a].length; t++) {
                if (!targetSpot) {
                    targetSpot = posses[a][t];
                    dist_target_this = diff(targetSpot, x);
                } else {
                    let difference = diff(posses[a][t].x, x);
                    targetSpot = difference < dist_target_this ? posses[a][t] : targetSpot;
                }
            }
        }
        if (targetSpot.type !== "tent"){
            let neighs = [targetSpot.left_spot, targetSpot.right_spot, targetSpot.above_spot, targetSpot.bottom_spot];
            targetSpot = first(neighs.filter(e => !e.gridItem));
        }
        return targetSpot;
    }


    getRandomNeighbour() {
        const neighBours = [this.left_spot, this.right_spot, this.above_spot, this.bottom_spot];
        let chosen = false;
        while (!chosen) {
            let random = randomInt(0, neighBours.length - 1);
            if (neighBours[random] != null && neighBours[random].available_for_groups) {
                chosen = neighBours[random];
            }
        }
        return chosen;
    }

    getGridItem() {
        return this.gridItem;
    }

    isAvailable() {
        return this.gridItem === null ? true : false;
    }

    get available_for_groups() {
        if (this.gridItem) {
            if (contains(this.not_available_types, this.gridItem.type))
                this.#available_for_groups = false;
            if (this.gridItem.type === 'tent' && this.gridItem.people_amount !== this.gridItem.max_visitors) {
                this.#available_for_groups = true;
            }
        }
        return this.#available_for_groups;
    }

    set available_for_groups(v) {
        this.#available_for_groups = v;
    }

    addGroup(group) {
        if (this.available_for_groups) {
            const fits = this.checkIfNewGroupFits(group);
            if (fits) {
                superVerbose(`Found new gridspot for ${group.id}.`);
                superVerbose(`Found new gridspot for x:${this.x} y:${this.y}.`);
                this.simulationItems.push(group);
                this.updateAmounts(group);
                this.should_flash = true;
                group.setGridSpot(this);
                group.checkIfReachedGoal();
                this.determineAvailableForGroups();
                return true;
            }
        } else {
            return this.available_for_groups;
        }
    }

    determineAvailableForGroups() {
        if (this.gridItem) {
            if (this.gridItem.type === "tent") {
                if (this.simulationItems.actual_length() === 1) {
                    this.available_for_groups = false;
                }
            }
            if (this.gridItem.type === "toilet") {
                return this.gridItem.people_amount <= 63;
            }
        } else {
            if (this.getCountPeople() >= this.max_peopleAmount) {
                this.available_for_groups = false;
            }
        }
    }

    updateAmounts(item) {
        if (this.gridItem) {
            this.gridItem.people_amount += item.size;
        } else {
            this.peopleAmount += item.size;
        }
    }

    checkIfNewGroupFits(item) {
        if (this.gridItem) {
            if (this.gridItem.type === "tent") {
                return this.gridItem.people_amount + item.size <= 63;
            }
            if (this.gridItem.type === "toilet") {
                return this.simulationItems.actual_length() + 1 === 1;
            }
        } else {
            return this.getCountPeople() + item.size <= 7;
        }
    }

    removeSimulationItem(group) {
        for (let i = 0; i < this.simulationItems.actual_length(); i++) {
            if (this.simulationItems[i] === group) {
                this.simulationItems.splice(i, 1);
                this.available_for_groups = true;
                this.peopleAmount -= group.size;
            }
        }
    }

    getCountPeople() {
        let size = 0;
        this.simulationItems.forEach(e => {
            size += e.size;
        })
        return size;
    }

    cleanSimulation() {
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

    get fCost() {
        return this.gCost + this.hCost;
    }

    get A_Neighbours() {
        const neighs = [];

        // left
        if (this.left_spot) {
            neighs.push(this.left_spot);
            if (this.left_spot.above_spot) {
                neighs.push(this.left_spot.above_spot)
            }
            if (this.left_spot.bottom_spot) {
                neighs.push(this.left_spot.bottom_spot)
            }
        }

        // right
        if (this.right_spot) {
            neighs.push(this.right_spot);
            if (this.right_spot.above_spot) {
                neighs.push(this.right_spot.above_spot)
            }
            if (this.right_spot.bottom_spot) {
                neighs.push(this.right_spot.bottom_spot)
            }
        }

        // above
        if (this.above_spot)
            neighs.push(this.above_spot);
        // below
        if (this.bottom_spot)
            neighs.push(this.bottom_spot);
        return neighs;
    }

}