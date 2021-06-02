"use strict";

export default class Gridspot {

    y; x;
    #peopleAmount;
    #peopleCollection = [];
    #gridItem = null;
    #available = true;
    position;

    left_spot;
    right_spot;
    above_spot;
    bottom_spot;

    // y = row, col = x
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = 'x: ' + x + ' y:' + y;
    }

    // returns type of deleted item
    cleanSpot() {
        let type = this.#gridItem.type;
        this.#gridItem = null;
        this.#available = true;
        return type;
    }

    getGridItem() {
        return this.#gridItem;
    }

    isAvailable() {
        return this.#available;
    }

    /// return true if placed succesfully.
    /// else false
    addGridItem(item) {
        if (this.isAvailable()) {
            let width = item.width;
            let height = item.height;

            // check if it can be placed. Whichever point of the item you're dragging doesn't matter. It always calculates from the left upper point. 
            let canBePlaced = this.canItemBePlaced(width, height);
            // console.log(canBePlaced);

            if (canBePlaced) {
                this.placeItem(width, height, item);
                return true;
            } else {
                return false;
            }
        } else {
            return this.#available;
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
        this.#gridItem = item;
        this.#available = false;
        item.coordinates.push(this);
    }

    placeItemBottom(height, item) {
        if (height == 0) {
            return;
        }
        if (this.bottom_spot != null || this.bottom_spot != undefined) {
            this.bottom_spot.placeItemBottom(height - 1, item);
        }
        this.#gridItem = item;
        this.#available = false;
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