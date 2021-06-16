import Group from "./Group";
import GroupView from "../view/Canvas/GroupView";
import randomInt from "../helpers/randomInt";
import randomTrueFalse from "../helpers/randomTrueFalse";
import {superVerbose, verbose} from "../helpers/logger";

export default class Queue {

    id;
    // groups = [];
    groups_in_queue = [];
    removed = [];       // temp
    group_amount = -1;
    active = true;
    regionController;
    previous_group = null;

    group_spawn_limiter = 10;
    amount_spawned = 0;
    max_groups_in_queue = 7;

    desk_waitTime_min = 0;
    desk_waitTime_max = 3000;

    constructor(id, regionController) {
        this.id = id;
        this.regionController = regionController;
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
        if (this.groups_in_queue.actual_length() < this.max_groups_in_queue) {
            superVerbose("Entering add group, groups_in_queue length check succeeded");
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
                verbose({text: `Correct lane for queue ${this.id} selected. Current previous group:`,
                    group: this.previous_group, text2: `Setting new previous group for queue ${this.id}`, object: group});
                this.previous_group.setPreviousGroup(group);
            }
            this.previous_group = group;
            this.groups_in_queue[groupId] = group;
            return group;
        }
        return null;
    }

    /*
     Handles placement of group in region
     */
    handleGroup(group) {
        if (this.group_spawn_limiter === 0 || this.amount_spawned !== this.group_spawn_limiter) {
            superVerbose(`Handle group ${group.id}.`);
            superVerbose(`Amount spawned ${this.amount_spawned}`);
            let waitTime = randomInt(this.desk_waitTime_min, this.desk_waitTime_max);
            setTimeout(() => {
                group.unpause();
                this.amount_spawned += 1;
                if (this.regionController.simulationController)
                    group.setGridSpot(this.regionController.simulationController.placeGroupInRegion(group));
            }, waitTime);
        }
    }

    cleanup() {
        for (let i = 0; i < this.groups_in_queue.actual_length(); i++) {
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