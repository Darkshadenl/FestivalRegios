export default class GroupView {

    x;
    y;
    id;
    toBeRemoved = false;

    constructor(model) {
        this.id = model.id;
        this.x = model.x;
        this.y = model.y;
        this.image = new Image();
        this.image.src = this.determineImage(model.size);
    }

    refreshData(model) {
        this.toBeRemoved = model.toBeRemoved;
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

    draw(c){
        c.save();
        c.drawImage(this.image, this.x, this.y);
        c.restore();
    }

    update(ctx){
        this.draw(ctx);
    }

}