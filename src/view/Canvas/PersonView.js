export default class PersonView {

    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = 0.3;
        this.image = new Image();
        this.image.src = "../../resources/person1.png";
    }

    pause(){
        this.speed = 0;
    }

    draw(c){
        c.save();
        this.x += this.speed;
        c.drawImage(this.image, this.x, this.y);
        c.restore();
    }

    update(ctx){
        this.draw(ctx);
    }


}