export default class EntryView {

    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    draw(c){
        c.save();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillRect(this.x, this.y, this.width, this.height);
        c.restore();
    }

    update(ctx){
        this.draw(ctx);
    }


}