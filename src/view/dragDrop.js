export default class DragDrop {

    #controller
    #usedDeleteBox = false;
    deleteBox;
    #regionview;
    #succesfullPlacement = true;

    #classes = ['tent', 'eetkraampje', 'drankkraampje', 'boom', 'toilet', 'prullenbak']

    constructor(controller, regionView) {
        this.#controller = controller;
        this.#regionview = regionView;
    }

    // draggable start
    dragStart(e) {
        this.deleteBox = document.getElementById('deleteBox');

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
        let id = e.dataTransfer.getData("type");
        let element = document.getElementById(id);
        
        if (!element.classList.contains('dropZone')) {
            // get containers.
            let col = e.target.id;
            let row = e.target.parentNode.id;
            let colrow = this.getActualColRow(col, row);

            // place element, return coordinates of other spots to be filled
            let toBeFilledCoordinates = this.#controller.current_region.placeElement(id, colrow['col'], colrow['row']);

            e.target.classList.remove("solid-border");

            switch (id) {
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
        } else {
            this.#succesfullPlacement = false;
            e.target.classList.remove("solid-border");
        }
    }

    getActualColRow(col, row) {
        let rowPos = col.indexOf('row');
        col = parseInt(col.slice(3, rowPos));
        row = parseInt(row.slice(3, row.length));

        return { 'col': col, 'row': row }
    }

    getHtmlReadyCol(col, row) {
        return 'col' + col + 'row' + row;
    }

    fillSpots(toBeFilledCoordinates, classTypeString) {
        if (toBeFilledCoordinates == null) {
            this.#succesfullPlacement = false;
            window.alert('Dit item kan niet hier geplaatst worden!');
        } else {
            toBeFilledCoordinates.forEach(e => {
                let xy = 'col' + e.x + 'row' + e.y;
                let element = document.getElementById(xy);
                let new_element = this.cleanElement(element);
                this.#regionview.makeGridPuzzlePiece(new_element);
                new_element.draggable = true;
                new_element.classList.add(classTypeString);
            })
        }
    }

    cleanElement(element) {
        let old_element = element;
        let new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        return new_element;
    }

    deleteBoxDrop(e) {
        this.deleteBox.classList.remove("solid-border");
        let id = e.dataTransfer.getData('type');
        let classlist = e.dataTransfer.getData('classlist');

        let element = document.getElementById(id);
        let parentNodeId = element.parentNode.id;

        if (element.classList.contains('puzzlePiece')) {
            // let nr = parseInt(element.innerText);
            let amount = parseInt(this.#controller.current_region.festivalItemsAmounts[id]);
            amount = amount + 1;
            this.#controller.current_region.festivalItemsAmounts[id] = amount;
        } else if (element.classList.contains('col')) {
            // check data to know which spots to clean
            // clean data
            let colrow = this.getActualColRow(id, parentNodeId);
            let coordinatesAndType = this.#controller.current_region.removeElement(colrow['col'], colrow['row']);

            // clean spots
            coordinatesAndType['coordinates'].forEach(coordinate => {
                let element = document.getElementById(this.getHtmlReadyCol(coordinate['x'], coordinate['y']));

                this.#classes.forEach(el => {
                    if (element.classList.contains(el)) {
                        element.classList.remove(el);
                    }
                });
                let new_element = this.cleanElement(element);
                this.#regionview.reconfigureGridElement(new_element);
            })
            // update model
            this.#controller.current_region.festivalItemsAmounts[coordinatesAndType['type']] += 1;
            // add to puzzlepieces to be able to placed again
            let amount = this.#controller.current_region.festivalItemsAmounts[coordinatesAndType['type']];
            let element = document.getElementById(coordinatesAndType['type']);
            element.innerText = amount;
            element.draggable = true;
        }

    }

    dragEnd(e) {
        if (this.#succesfullPlacement && e.dataTransfer.dropEffect !== "none") {
            // update model
            let amount = parseInt(this.#controller.current_region.festivalItemsAmounts[e.target.id]);
            amount -= 1;
            this.#controller.current_region.festivalItemsAmounts[e.target.id] = amount;
            // update view
            e.target.innerText = amount;
            // disable draggable if 0
            if (amount == 0) {
                e.target.draggable = false;
            }

            this.#controller.UpdateLocalStorage();
        } else {
            this.#succesfullPlacement = true;
        }
    }
}
