export default class GroupView {

    constructor(model) {
        this.id = model.id();
        this.x = model.x();
        this.y = model.y();
        this.speed = 0.9;
        this.image = new Image();
        this.image.src = this.determineImage(model.size);
    }

    refreshData(model) {
        this.x = model.x;
        this.y = model.y;
    }

    determineImage(size){
        switch (size) {
            case 1:
                return "../../resources/person1.png"
            case 2:
                return "../../resources/person2.png"
            case 3:
                return "../../resources/person3.png"
            case 4:
                return "../../resources/person4.png"
        }
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