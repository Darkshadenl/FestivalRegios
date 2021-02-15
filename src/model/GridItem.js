"use strict";

import Sizes from "../enums/sizes"

export default class GridItem {

    name;
    type;
    width;
    height;
    coordinates = [];

    constructor(type) {
        this.type = type;
        this.determineSize();
    }

    determineSize() {
        switch (this.type) {
            case 'tent':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'eetkraampje':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'drankkraampje':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'boom':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'toilet':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'prullenbak':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
        }
    }

}