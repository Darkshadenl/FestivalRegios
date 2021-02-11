export default class DragDrop {

    #controller
    #usedDeleteBox = false;
    #deleteBox;
    #regionview;

    // #placedClasses = ['tentPlaced', 'eetkraampjePlaced', 'drankkraampjePlaced', 'boomPlaced', 'toiletPlaced', 'prullenbakPlaced']

    constructor(controller, regionView) {
        this.#controller = controller;
        this.#regionview = regionView;
    }

    // draggable start
    dragStart(e) {
        if (!this.#deleteBox){
            this.#deleteBox = document.getElementById('deleteBox');
        }
        e.dataTransfer.setData("type", e.target.id);
        e.dataTransfer.setData("classlist", e.target.classList);
    }

    dragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains("dropZone") || e.target.id == 'deleteBox') {
            e.target.classList.add("solid-border");
        }
    }

    dragLeave(e) {
        e.target.classList.remove("solid-border");
    }

    dropEvent(e) {
        e.preventDefault();
        let draggableType = e.dataTransfer.getData("type");
        // get containers.
        let col = e.target.id;
        let row = e.target.parentNode.id;
        col = parseInt(col.slice(3, 4));
        row = parseInt(row.slice(3, 4));

        console.log(col);
        console.log(row);

        this.#controller.current_region.placeElement(draggableType, col, row);

        e.target.classList.remove("solid-border");

        e.target.draggable = true;

        switch (draggableType) {
            case "tent":
                e.target.classList.add("tent");
                // e.target.classList.add("tentPlaced");
                break;
            case "eetkraampje":
                e.target.classList.add("eetkraampje");
                // e.target.classList.add("eetkraampjePlaced");
                break;
            case "drankkraampje":
                e.target.classList.add("drankkraampje");
                // e.target.classList.add("drankkraampjePlaced");
                break;
            case "boom":
                e.target.classList.add("boom");
                // e.target.classList.add("boomPlaced");
                break;
            case "toilet":
                e.target.classList.add("toilet");
                // e.target.classList.add("toiletPlaced");
                break;
            case "prullenbak":
                e.target.classList.add("prullenbak");
                // e.target.classList.add("prullenbakPlaced");
                break;
        }

        let old_element = e.target;
        let new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        e.target.addEventListener("dragstart", this.dragStart, false);

        




    }

    deleteBoxDrop(e) {
        this.#deleteBox.classList.remove("solid-border");
        // let id = e.dataTransfer.getData('type');
        // let classlist = e.dataTransfer.getData('classlist');

        // if (classlist.contains(''))

        // let puzzlePiece = document.getElementById(id);
        // let nr = parseInt(puzzlePiece.innerText);
        // nr += 1;
        // puzzlePiece.innerText = nr;
    }

    dragEnd(e) {
        if (e.dataTransfer.dropEffect !== "none") {
            // make number go down
            let amount = parseInt(e.target.innerText);
            amount -= 1;
            e.target.innerText = amount;
            // disable draggable if 0
            if (amount == 0) {
                e.target.draggable = false;
            }
        }
    }
}
