"use strict";

import Region from "./screen";

export default class Festival {

    #regios = [new Region('Regio1'), new Region('Regio2')];
    #currentScreen;

    constructor() {
        this.#currentScreen = this.#regios[0];
    }

    set Current(newVal){
        this._currentScreen = newVal;
    }

    get current(){
        return this._currentScreen;
    }

}