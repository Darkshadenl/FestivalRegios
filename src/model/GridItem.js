import Sizes from "../enums/sizes"

export default class GridItem {

    name;
    type;
    details = "";
    max_visitors = "";
    opens_at = "";
    closes_at = "";
    capacity_in_kilo = "";
    empty_moment_in_seconds = 30;
    toilet_full = false;

    width;
    height;
    coordinates = [];

    constructor(type) {
        this.type = type;
        this.determineSize();
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