"use strict";

export default class Gridspot {

    y; x;
    #peopleAmount;
    gridItem;
    
    // y = row, col = x
    constructor(y, x) {
      this.x = x;
      this.y = y;  
    }

    isAvailable(){
        if (this.gridItem){
            return false;
        }
    }

    addPeople(amount){
        this.#peopleAmount += amount;
    }

    peopleAmount(){
        return this.#peopleAmount;
    }


}