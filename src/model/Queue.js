import Group from "./Group";
import GroupView from "../view/Canvas/GroupView";
import randomInt from "../helpers/randomInt";
import randomTrueFalse from "../helpers/randomTrueFalse";

export default class Queue {

    id;
    // groups = [];
    groups_in_queue = [];
    removed = [];       // temp
    group_amount = -1;
    active = true;
    simController;
    regionController;
    previous_group = null;

    group_spawn_limiter = 0;
    amount_spawned = 0;
    max_groups_in_queue = 7;

    constructor(id, regionController) {
        this.id = id;
        this.regionController = regionController;
        // this.simController = simController;
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

    addGroup(amount) {
        this.cleanup();
        if (Object.keys(this.groups_in_queue).length < this.max_groups_in_queue) {
            let group;
            this.group_amount += 1;
            let groupId = this.group_amount;
            switch (this.id) {
                case 1:
                    group = new Group(amount, 10, 5, this, groupId);
                    break;
                case 2:
                    group = new Group(amount, 10, 50, this, groupId);
                    break;
                case 3:
                    group = new Group(amount, 10, 90, this, groupId);
                    break;
                case 4:
                    group = new Group(amount, 10, 140, this, groupId);
                    break;
                default:
                    console.log("No correct id");
                    break;
            }
            if (this.previous_group !== null) {
                this.previous_group.setPreviousGroup(group);
            }

            this.groups_in_queue[groupId] = group;
            this.previous_group = group;
            return group;
        }
        return null;
    }

    /*
     Handles placement of group in region
     */
    handleGroup(group) {
        if (this.group_spawn_limiter === 0 || this.amount_spawned !== this.group_spawn_limiter) {
            console.log('Handle group');
            let waitTime = randomInt(1000, 3000);
            setTimeout(() => {
                group.unpause();
            }, waitTime);
            this.amount_spawned += 1;
            group.setGridSpot(this.regionController.getSimulationController().placeGroupInRegion(group));
        }
    }

    cleanup() {
        for (let i = 0; i < this.groups_in_queue.length; i++) {
            let g = this.groups_in_queue[i];
            if (g === undefined || g.toBeRemoved === true || g === null) {
                this.groups_in_queue.splice(i, 1);
            }
        }
    }

    ShouldIAddGroup() {
        return randomTrueFalse();
    }
};