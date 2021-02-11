"use strict";

import Region from "./region";

export default class Festival {

    regions = []

    constructor(amount_regions) {
        for (let index = 1; index < amount_regions+1; index++) {
            this.regions.push(new Region(index, 'Regio' + ' ' + index))
        }
    }

    getDefaultModel(){
        return this.regions[0];
    }

    getModel(id){
        let found_model;
        this.regions.forEach(e => {
            if (e.id == id){
                found_model = e;
            }
        })
        found_model.retrieveDataFromLocalStorage();
        return found_model;
    }

}