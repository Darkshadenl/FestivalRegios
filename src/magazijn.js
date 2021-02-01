"use strict";

import Screen from "./screen";

export default class Magazijn {

    #items = [new Screen('Kleding'), new Screen('Tierlantijn'), new Screen('Decoratie')];
    #currentScreen;

    constructor() {
        this.#currentScreen = this.#items[0];
        console.log("Magazijn cons run");
    }

    set Current(newVal){
        this._currentScreen = newVal;
    }

    get current(){
        return this._currentScreen;
    }

}