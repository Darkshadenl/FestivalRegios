import randomInt from "../helpers/randomInt";

export default class Group {

    id;
    size;
    x;
    y;
    queue;
    def_speed = 3;
    speed = this.def_speed;
    previous_group = null;  // used for linking groups in queue
    temp_wait_x_range = [];
    paused;                 // queue stuff
    toBeRemoved= false;     // queue stuff
    toBePaused = false;     // queue stuff
    checked = false;        // queue stuff
    #current_gridSpot = null;
    #previous_gridSpot = false;

    constructor(size, x, y, queue, id) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.queue = queue;
        this.id = id;
    }

    shouldIMove(){
        let shouldI = randomInt(0, 1);
        return shouldI !== 0;
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
        // if (this.id == 1) {
        //     console.log(this.#previous_gridSpot);
        //     console.log(this.#current_gridSpot);
        // }
    }

    get previousGridSpot(){
        return this.#previous_gridSpot;
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