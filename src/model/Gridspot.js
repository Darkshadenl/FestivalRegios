"use strict";

export default class Gridspot {

    y; x;
    #peopleAmount;
    #gridItem = undefined;

    left_spot;
    right_spot;
    above_spot;
    bottom_spot;
    
    // y = row, col = x
    constructor(x, y) {
      this.x = x;
      this.y = y;  
    }

    isAvailable(){
        let available = true;
        if (this.gridItem){
            available = false;
        }
        return available;
    }

    /// return true if placed succesfully.
    /// else false
    addGridItem(item){
        if (this.isAvailable()){
            let width = item.width;
            let length = item.length;

            // if ()
            
            this.#gridItem = item;
            return true;
        } else {
            return available;
        }
    }

    addPeople(amount){
        if (this.isAvailable()){
            this.#peopleAmount += amount;
        }
    }

    peopleAmount(){
        return this.#peopleAmount;
    }


}