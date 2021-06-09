export default class EntryView {

    constructor(width, height, x, y, id) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = "red";
    }

    draw(c){
        c.save();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
        c.restore();
    }

    update(ctx){
        this.draw(ctx);
    }

    wasIClicked(clicked_x, clicked_y, ctx){
        let min_x = this.x + 3;
        let max_x = this.x + 30;
        let min_y = this.y + 3;
        let max_y = this.y + 40;

        if (clicked_x >= min_x && clicked_x <= max_x &&
        clicked_y >= min_y && clicked_y <= max_y){
            this.color = this.color === "red" ? "black" : "red";
            return true;
        }
        return false;
    }


}