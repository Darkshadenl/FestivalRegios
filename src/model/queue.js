export default class Queue {
    time;
    speedCounter;
    amountInQueue;

    constructor (time){
        this.time = time;
        this.amountInQueue = 0;
        this.speedCounter = 0;
    }

    addToQueue(){
        this.amountInQueue = Math.floor(Math.random() * 3 + 1); 
    }

    getQueued(){
        if (this.amountInQueue == 0){
            this.addToQueue();
            return 0;
        }
        else {
            if (this.speedCounter >= this.time) {
                var returnValue = this.amountInQueue;
                this.speedCounter = 0;
                this.amountInQueue = 0;
                return returnValue;
            }
            else {
                this.speedCounter ++;
                return 0;
            }
        }
    }

    getAmountInQueue(){
        return this.amountInQueue;
    }
}