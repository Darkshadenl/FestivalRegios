"use strict";

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

    buildGridData(){
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                this.gridSpots.push(y, x);
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

