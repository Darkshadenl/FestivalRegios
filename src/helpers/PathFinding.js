import {contains, without} from "underscore";
import {superVerbose} from "./logger";

export default function PathFinding(starting_spot, target_spot) {
    if (!starting_spot || !target_spot) return;
    superVerbose('pathfinding');
    let startNode = starting_spot;
    let targetNode = target_spot;
    superVerbose(startNode);
    superVerbose(targetNode);
    let openSet = [];
    let closedSet = [];
    openSet.push(startNode);

    let done = 0;

    while (openSet.length > 0) {
        let currentNode = openSet[0];

        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].fCost < currentNode.fCost || openSet[i].fCost === currentNode.fCost
                && openSet[i].hCost < currentNode.hCost) {
                currentNode = openSet[i];
            }
            superVerbose('komt in eerste for loop na eerst fcost check');
            openSet = without(openSet, currentNode);
            closedSet.push(currentNode);

            if (currentNode === targetNode) {
                superVerbose('path klaar.');
                return retracePath(startNode, targetNode);
            }

            for (let j = 0; j < currentNode.A_Neighbours.length; j++) {
                superVerbose('tweede for loop');
                let neighbour = currentNode.A_Neighbours[j];
                if (!neighbour.available_for_groups || contains(closedSet, neighbour)) {
                    continue;
                }
                let newMovementCostToNeighbour = currentNode.gCost + getDistance(currentNode, neighbour);
                if (newMovementCostToNeighbour < neighbour.gCost || !contains(openSet, neighbour)) {
                    neighbour.gCost = newMovementCostToNeighbour;
                    neighbour.hCost = getDistance(neighbour, targetNode);
                    neighbour.parent = currentNode;

                    if (!contains(openSet, neighbour))
                        openSet.push(neighbour);
                }
            }
        }
        done += 1;
    }
}

function retracePath(startNode, endNode) {
    let path = [];
    let currentNode = endNode;

    while (currentNode !== startNode) {
        path.push(currentNode);
        currentNode = currentNode.parent;
    }
    superVerbose('End pathfinding');
    return path;
}

function getDistance(nodeA, nodeB) {
    let dstX = Math.abs(nodeA.x - nodeB.x);
    let dstY = Math.abs(nodeA.y - nodeB.y);

    if (dstX > dstY) {
        return 14 * dstY + 10 * (dstX - dstY);
    }
    return 14 * dstX + 10 * (dstY - dstX);
}