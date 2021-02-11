export default class DragDrop {

    #controller
    #usedDeleteBox = false;
    #deleteBox;
    #regionview;
    #succesfullPlacement = true;

    // #placedClasses = ['tentPlaced', 'eetkraampjePlaced', 'drankkraampjePlaced', 'boomPlaced', 'toiletPlaced', 'prullenbakPlaced']

    constructor(controller, regionView) {
        this.#controller = controller;
        this.#regionview = regionView;
    }

    // draggable start
    dragStart(e) {
        if (!this.#deleteBox) {
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
        let rowPos = col.indexOf('row');
        col = parseInt(col.slice(3, rowPos));
        row = parseInt(row.slice(3, row.length));

        // place element, return coordinates of other spots to be filled
        let toBeFilledCoordinates = this.#controller.current_region.placeElement(draggableType, col, row);

        e.target.classList.remove("solid-border");


        switch (draggableType) {
            case "tent":
                this.fillSpots(toBeFilledCoordinates, 'tent', e.target);
                break;
            case "eetkraampje":
                this.fillSpots(toBeFilledCoordinates, 'eetkraampje', e.target);
                break;
            case "drankkraampje":
                this.fillSpots(toBeFilledCoordinates, 'drankkraampje', e.target);
                break;
            case "boom":
                this.fillSpots(toBeFilledCoordinates, 'boom', e.target);
                break;
            case "toilet":
                this.fillSpots(toBeFilledCoordinates, 'toilet', e.target);
                break;
            case "prullenbak":
                this.fillSpots(toBeFilledCoordinates, 'prullenbak', e.target);
                break;
        }
    }

    fillSpots(toBeFilledCoordinates, classTypeString) {
        if (toBeFilledCoordinates == null) {
            this.#succesfullPlacement = false;
            window.alert('Dit item kan niet hier geplaatst worden!');
        } else {
            
            toBeFilledCoordinates.forEach(e => {
                let xy = 'col' + e.x + 'row' + e.y;
                let element = document.getElementById(xy);

                let old_element = element;
                let new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                new_element.addEventListener("dragstart", this.dragStart, false);
                new_element.draggable = true;
                new_element.classList.add(classTypeString);
            })
        }
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
        if (this.#succesfullPlacement && e.dataTransfer.dropEffect !== "none") {
            // make number go down
            let amount = parseInt(e.target.innerText);
            amount -= 1;
            e.target.innerText = amount;
            // disable draggable if 0
            if (amount == 0) {
                e.target.draggable = false;
            }
        } else {
            this.#succesfullPlacement = true;
        }
    }
}
