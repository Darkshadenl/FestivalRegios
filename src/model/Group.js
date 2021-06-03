export default class Group {

    id;
    size;
    x;
    y;
    queue;
    def_speed = 1.5
    speed = this.def_speed;
    previous_group = null;
    temp_wait_x_range = [];
    paused;
    toBeRemoved= false;
    toBePaused = false;
    checked = false;

    constructor(size, x, y, queue, id) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.queue = queue;
        this.id = id;
    }

    moveUpdate() {
        this.shouldPause();
        this.checkReachedDesk();
        this.x += this.speed;
        if (this.x > 340) {
            this.toBeRemoved = true;
        }
    }

    checkReachedDesk(){
        if (this.x > 320 && !this.checked){
            this.pause();
            if (this.previous_group != null)
                this.previous_group.setToBePaused(this.x);
            this.queue.handleGroup(this);
            this.checked = true;
        }
    }

    shouldPause() {
        if (this.toBePaused) {
            if (this.x >= this.temp_wait_x_range['a'] && this.x <= this.temp_wait_x_range['b']){
                console.log(this.previous_group)
                if (this.previous_group)
                    this.previous_group.setToBePaused(this.x);
                this.pause();
            }
        }
    }

    setToBePaused(x_of_next){
        console.log('Pausing prev group');
        this.toBePaused = true;
        this.temp_wait_x_range['a'] = x_of_next - 50;
        this.temp_wait_x_range['b'] = x_of_next - 5;
        this.shouldPause();
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

}