import Sizes from "../enums/sizes"
import {superVerbose} from "../helpers/logger";

export default class GridItem {

    name;
    type;
    details = "";
    max_visitors = "63";
    opens_at = "13:00";
    closes_at = "21:00";
    capacity_in_kilo = "";
    empty_moment_in_seconds = 30;
    toilet_full = false;

    #people_amount = 0;

    width;
    height;
    coordinates = [];

    constructor(type) {
        this.type = type;
        this.determineSize();
    }

    resetGridItem() {
        this.people_amount = 0;
        this.toilet_full = false;
        this.empty_moment_in_seconds = 30;
    }

    set people_amount(value) {
        this.#people_amount = value;
        if (this.type === "toilet"){
            superVerbose(`Toilet people amount = ${value}`);
            if (value > 0) {
                this.toilet_full = true;
                superVerbose('setting toilet full to true');
            } else if (value === 0) {
                this.toilet_full = false;
                superVerbose('setting toilet full to false');
            }
        }
    }

    get people_amount() {
        return this.#people_amount;
    }

    setupDetails(details) {
        if (!details) return;
        this.details = details.details;
        this.max_visitors = details.max_visitors;
        this.opens_at = details.opens_at;
        this.closes_at = details.closes_at;
        this.capacity_in_kilo = details.capacity_in_kilo;
        this.empty_moment_in_seconds = details.empty_moment_in_seconds;
        this.toilet_full = details.toilet_full;
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
            case 'hogeBoom':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'bredeBoom':
                this.width = Sizes[this.type]['width'];
                this.height = Sizes[this.type]['height'];
                break;
            case 'schaduwBoom':
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