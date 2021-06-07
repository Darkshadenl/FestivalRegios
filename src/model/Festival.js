import Region from "./Region";

export default class Festival {

    #regions = []
    controller;

    constructor(amount_regions, controller) {
        this.controller = controller;
        for (let index = 1; index < amount_regions+1; index++) {
            this.regions.push(new Region(index, 'Regio' + ' ' + index, controller))
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

    get regions(){
        return this.#regions;
    }

    set regions(value){
        this.#regions = value;
    }

}