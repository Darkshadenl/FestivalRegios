import Group from "./Group";
import GroupView from "../view/Canvas/GroupView";

export default class Queue {

    id;
    max_groups_in_queue = 5;
    groups = [];
    groups_in_queue = [];
    groups_on_field = [];
    group_amount = 0;
    active = true;

    constructor(id) {
        this.id = id;
    }

    getGroupModel(id){
        this.groups.filter(g => {
            if (g.id == id) {
                return g;
            }
        })
    }

    addPeople(amount) {
        if (this.groups_in_queue.length < this.max_groups_in_queue) {
            let x;
            this.group_amount += 1;
            switch (this.id) {
                case 0:
                    x = new Group(amount, 10, 5, this.group_amount);
                    break;
                case 1:
                    x = new Group(amount, 10, 50, this.group_amount);
                    break;
                case 2:
                    x = new Group(amount, 10, 90, this.group_amount);
                    break;
                case 3:
                    x = new Group(amount, 10, 140, this.group_amount);
                    break;
                default:
                    console.log("No correct id");
                    break;
            }
            this.groups.push(x);
            this.groups_in_queue.push(x);
            return x;
        }
    }

}