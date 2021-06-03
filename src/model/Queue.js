import Group from "./Group";
import GroupView from "../view/Canvas/GroupView";
import randomIntFromInterval from "../helpers/randomIntFromInterval";

export default class Queue {

    id;
    max_groups_in_queue = 7;
    // groups = [];
    groups_in_queue = [];
    removed = [];       // temp
    group_amount = -1;
    active = true;
    simController;
    previous_group = null;

    constructor(id, simController) {
        this.id = id;
        this.simController = simController;
    }

    getGroupModel(id) {
        let m;
        this.groups_in_queue.some(e => {
            if (e && e.id === id) {
                m = e;
                return true;
            }
        });
        m.moveUpdate();
        return m;
    }

    addPeople(amount) {
        this.cleanup();
        console.log(this.groups_in_queue);
        if (Object.keys(this.groups_in_queue).length < this.max_groups_in_queue) {
            let group;
            this.group_amount += 1;
            let id = this.group_amount;
            switch (this.id) {
                case 0:
                    group = new Group(amount, 10, 5, this, id);
                    break;
                case 1:
                    group = new Group(amount, 10, 50, this, id);
                    break;
                case 2:
                    group = new Group(amount, 10, 90, this, id);
                    break;
                case 3:
                    group = new Group(amount, 10, 140, this, id);
                    break;
                default:
                    console.log("No correct id");
                    break;
            }
            if (this.previous_group !== null) {
                this.previous_group.setPreviousGroup(group);
            }

            this.groups_in_queue[id] = group;
            this.previous_group = group;
            return group;
        }
        return null;
    }

    handleGroup(group) {
        let waitTime = randomIntFromInterval(1000, 3000);
        setTimeout(() => {
            group.unpause();
        }, waitTime);
        // this.simController.placeGroupInRegion(group);
    }

    cleanup() {
        for (let i = 0; i < this.groups_in_queue.length; i++) {
            let g = this.groups_in_queue[i];
            if (g === undefined || g.toBeRemoved === true || g === null) {
                this.groups_in_queue.splice(i, 1);
            }
        }
    }
}