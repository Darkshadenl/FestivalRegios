"use strict";

export default class Region {

    // #items = ["blauwe sweater", "groene sweater", "paarse sweater"];
    #name;

    constructor(name) {
        this.#name = name;
    }

    get screenName(){
        return this.#name;
    }

    // get items(){
    //     return this.#items;
    // }

    retrieveItems(){
        let retrieved = () => {
            return JSON.parse(localStorage.getItem('items'));
        };

        // return items;
    }

}

