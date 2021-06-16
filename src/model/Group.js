import randomInt from "../helpers/randomInt";
import {contains, last} from "underscore";
import {superVerbose} from "../helpers/logger";
import Weather from "../enums/weather";

export default class Group {

    id;
    size;
    x;
    y;
    queue;
    def_speed = 0.7;
    speed = this.def_speed;
    previous_group = null;  // used for linking groups in queue
    temp_wait_x_range = [];
    paused;                 // queue stuff
    toBeRemoved= false;     // queue stuff
    toBePaused = false;     // queue stuff
    checked = false;        // queue stuff
    #current_gridSpot = null;
    #previous_gridSpot = false;
    inTent = false;
    inToilet = false;
    inTentIts = 0;
    inToiletIts = 0;

    path = null;
    next_spot = 0;
    path_retries = 0;
    target_spot;


    constructor(size, x, y, queue, id) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.queue = queue;
        this.id = id;
    }

    checkIfReachedGoal(){
        if (this.current_gridSpot === last(this.path)) {
            this.path = null;
            this.next_spot = 0;
        }
    }

    get current_gridSpot(){
        return this.#current_gridSpot;
    }

    shouldIMove(weatherType){
        if (this.current_gridSpot === this.target_spot) return false;
        if (!this.inTent && !this.inToilet){
            let shouldI;
            if (weatherType === Weather.REGEN)
                shouldI = true;
            else
                shouldI = randomInt(0, 1);
            return shouldI !== 0;
        } else {
            if (this.inTent){
                this.inTentIts += 1;
                superVerbose(`In tent its: ${this.inTentIts}`)
                if (this.inTentIts >= 4) {
                    this.inTent = false;
                    this.inTentIts = 0;
                }
                return 0;
            }
            if (this.inToilet){
                this.inToiletIts += 1;
                superVerbose(`In toilet its: ${this.inToiletIts}`)
                if (this.inToiletIts >= 2) {
                    this.inToilet = false;
                }
                return 0;
            }
        }
    }

    moveUpdate() {
        this.shouldPause();
        this.checkReachedDesk();
        this.x += this.speed;
        if (this.x > 330) {
            this.toBeRemoved = true;
        }
    }

    checkReachedDesk(){
        if (this.x > 320 && !this.checked){
            this.pause();
            if (this.previous_group !== null){
                this.previous_group.setToBePaused(this.x);
            }
            this.queue.handleGroup(this);
            this.checked = true;
        }
    }

    shouldPause() {
        if (this.toBePaused) {
            if (this.x >= this.temp_wait_x_range['a'] && this.x <= this.temp_wait_x_range['b']){
                this.pause();
                if (this.previous_group){
                    this.previous_group.setToBePaused(this.x);
                }
            }
        }
    }

    setToBePaused(x_of_next){
        this.toBePaused = true;
        this.temp_wait_x_range['a'] = x_of_next - 50;
        this.temp_wait_x_range['b'] = x_of_next - 10;
    }

    // either get paused by other group, or paused by queue.
    pause(){
        this.speed = 0;
        this.paused = true;
    }

    unpause(){
        this.paused = false;
        this.toBePaused = false;
        this.speed = this.def_speed;
        if (this.previous_group !== null){
            this.previous_group.unpause();
        }
    }

    setPreviousGroup(group){
        this.previous_group = group;
    }

    setGridSpot(gridSpot){
        if (!gridSpot) return;
        this.#previous_gridSpot = this.#current_gridSpot;
        this.#current_gridSpot = gridSpot;

        if (gridSpot.gridItem){
            if (gridSpot.gridItem.type === "toilet") {
                this.inToilet = true;
            }
            if (gridSpot.gridItem.type === "tent") {
                this.inTent = true;
            }
        }
    }

    retrieveGroupImageClass(){
        switch (this.size) {
            case 1:
                return "group1";
            case 2:
                return "group2";
            case 3:
                return "group3";
            case 4:
                return "group4";
        }
    }

}