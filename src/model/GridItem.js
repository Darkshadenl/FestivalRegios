"use strict";

export default class GridItem {

    name;
    type;
    width;
    hight;

    constructor(type) {
        this.type = type;
        this.determineSize();
    }

    determineSize(){

        switch (this.type){
            case 'tent':
                this.width = 3;
                this.height = 3;
                break;
            case 'eetkraampje':
                this.width = 1;
                this.height = 1;
                break;
            case 'drankkraampje':
                this.width = 2;
                this.height = 1;
                break;
            case 'boom':
                this.width = 1;
                this.height = 1;
                break;
            case 'toilet':
                this.width = 1;
                this.height = 3;
                break;
            case 'prullenbak':
                this.width = 1;
                this.height = 3;
                break;
            
        }

    }

}