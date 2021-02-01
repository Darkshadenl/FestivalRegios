"use strict";

export default class Region {

    // #broeken = ["blauwe broek", "groene broek", "paarse broek"];
    // #sweaters = ["blauwe sweater", "groene sweater", "paarse sweater"];
    #items = ["blauwe sweater", "groene sweater", "paarse sweater"];
    #name;

    constructor(name) {
        this.#name = name;
        this.retrieveItems();
        this.createDropDownMenu();
        console.log("Screen cons run");
    }

    get screenName(){
        return this.#name;
    }

    get items(){
        return this.#items;
    }

    retrieveItems(){
        let retrieved = () => {
            return JSON.parse(localStorage.getItem('items'));
        };

        // console.log(retrieved('Kleding'));

        // return items;
    }

}

