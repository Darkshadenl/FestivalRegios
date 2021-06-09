export default class Heap {

    currentItemCount = 0;
    items;

    constructor() {
        this.items = [];
    }

    add(node){
        node.heapIndex = this.currentItemCount;
        this.items[this.currentItemCount] = node;
        this.sortUp(node);
        this.currentItemCount++;
        console.log(this.currentItemCount);
    }

    removeFirst(){
        let firstItem = this.items[0];
        this.currentItemCount--;
        this.items[0] = this.items[this.currentItemCount];
        this.items[0].heapIndex = 0;
        this.sortDown(this.items[0]);
        return firstItem;
    }

    updateItem(node){
        this.sortUp(node);
    }

    get count(){
        return this.currentItemCount;
    }

    contains(node){
        if (node.heapIndex === undefined){
            return false;
        }
        return this.items[node.heapIndex] === node;
    }

    sortDown(node){
        while(true){
            let childIndexLeft = node.heapIndex * 2 + 1;
            let childIndexRight = node.heapIndex * 2 + 2;

            let swapIndex = 0;

            if (childIndexLeft < this.currentItemCount) {
                swapIndex = childIndexLeft;

                if (childIndexRight < this.currentItemCount) {
                    if (this.items[childIndexLeft].CompareTo(this.items[childIndexRight]) < 0) {
                        swapIndex = childIndexRight;
                    }
                }

                if (node.CompareTo(this.items[swapIndex]) < 0) {
                    this.swap(node, this.items[swapIndex]);
                }
                else {
                    return;
                }

            }
            else {
                return;
            }
        }
    }

    sortUp(node){
        let parentIndex = (node.heapIndex-1)/2;
        console.log(parentIndex);
        if (parentIndex < 0) return;

        while (true) {
            let parentItem = this.items[parentIndex];

            if (node.CompareTo(parentItem) > 0) {
                this.swap(node,parentItem);
            }
            else {
                break;
            }

            parentIndex = (node.heapIndex-1)/2;
        }
    }

    swap(nodeA, nodeB){
        this.items[nodeA.HeapIndex] = nodeB;
        this.items[nodeB.HeapIndex] = nodeA;
        let nodeAIndex = nodeA.HeapIndex;
        nodeA.HeapIndex = nodeB.HeapIndex;
        nodeB.HeapIndex = nodeAIndex;
    }

}