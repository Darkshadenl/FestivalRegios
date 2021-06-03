import DragDrop from "../view/DragDrop";
import extractXYPosition from "../helpers/extractXYPosition"
import DetailView from "./DetailView";
import Gridspot from "../model/Gridspot";
import GridItem from "../model/GridItem";

export default class regionView {
    element;
    regions;
    controller;
    dragDrop;
    rows = 15;
    cols = 15;
    ZIndexViewShowing = false;

    constructor(controller) {
        this.controller = controller;
        this.dragDrop = new DragDrop(controller, this);
    }

    buildRegionMenuButtons() {
        let regionMenu = document.getElementById("regionMenu");
        let buttons = [];
        let viewNames = [];

        let regionModels = this.controller.getRegions();

        regionModels.forEach((model) => {
            viewNames.push(model.name);
        });

        viewNames.forEach((name) => {
            let button = document.createElement("button");
            button.className = "btn btn-info ml-2";
            button.innerText = name;
            button.addEventListener("click", () => {
                regionModels.forEach((model) => {
                    if (model.name == button.innerText) {
                        this.controller.switchRegion(model.id);
                    }
                });
            });

            if (button.innerText == this.controller.getCurrentRegion().name) {
                button.classList.remove("btn-info");
                button.classList.add("btn-primary");
            }
            buttons.push(button);
        });

        let deleteBox = document.createElement("div");
        deleteBox.innerText = "Sleep hier naartoe om te verwijderen";
        deleteBox.className = "mt-2 deleteBox";
        deleteBox.id = "deleteBox";
        deleteBox.addEventListener(
            "dragover",
            (e) => {
                this.dragDrop.dragOver(e);
            },
            false
        );
        // deleteBox.addEventListener('dragleave', (e) => { this.#dragDrop.dragLeaveDeleteBox(e) }, false);
        deleteBox.addEventListener(
            "drop",
            (e) => {
                this.dragDrop.deleteBoxDrop(e);
            },
            false
        );

        buttons.forEach((e) => {
            regionMenu.appendChild(e);
        });
        regionMenu.appendChild(deleteBox);
    }

    cleanForSwitchToRegion() {
        // clean data of current region
        this.active = false;
        this.cleanRegion();
    }

    cleanRegion() {
        let dropzoneContainer = document.getElementsByClassName(
            "dropZoneContainer"
        );
        dropzoneContainer[0].remove();
        let regionMenuButtons = document.getElementById("regionMenu");
        while (regionMenuButtons.firstChild) {
            regionMenuButtons.removeChild(regionMenuButtons.lastChild);
        }
        if (document.getElementById("startSim")) document.getElementById("startSim").remove();
        if (document.getElementById("canvas")) document.getElementById("canvas").remove();

        let configbtnContainer = document.getElementById("configbtnContainer");
        while (configbtnContainer.firstChild) {
            configbtnContainer.removeChild(configbtnContainer.lastChild);
        }
    }

    lockRegion() {
        this.controller.lockCurrentRegion();
        this.controller.UpdateLocalStorage();
        let pieces = document.getElementById("piecesView");
        let gridpieces = document.getElementById("dropZoneRowContainer");
        let lockbtn = document.getElementById("lockRegioBtn");
        const piecesDiv = document.getElementById("pieces");
        const canvasDiv = document.createElement("div");
        canvasDiv.className = "mt-4";
        canvasDiv.id = "canvasDiv";
        piecesDiv.appendChild(canvasDiv);
        const api = document.getElementById("api");
        const btn = document.createElement("btn");
        btn.className = "ml-4 btn btn-success";
        btn.innerText = "Start sim";
        btn.id = "startSim";
        btn.addEventListener("click", () => { this.controller.startSim() })
        // this.controller.startSim();
        api.appendChild(btn);

        pieces.childNodes.forEach((e) => {
            if (e.hasChildNodes) {
                e.childNodes.forEach((f) => {
                    f.draggable = false;
                });
            }
        });

        gridpieces.childNodes.forEach((e) => {
            if (e.hasChildNodes) {
                e.childNodes.forEach((f) => {
                    f.draggable = false;
                    this.setupLockedPieceClick(f);
                });
            }
        });

        lockbtn.innerText = "Regio gelocked";
    }

    changeButton(started){
        const div = document.getElementById("api");
        const btn = document.createElement("btn");
        if (started) {
            document.getElementById("startSim").remove();
            btn.className = "ml-4 btn btn-danger";
            btn.innerText = "Stop sim";
            btn.id = "stopSim";
            btn.addEventListener('click', () => { this.controller.getSimulationController().stopSim() });
            div.appendChild(btn);
        } else {
            document.getElementById("stopSim").remove();
            btn.className = "ml-4 btn btn-success";
            btn.innerText = "Start sim";
            btn.id = "startSim";
            btn.addEventListener('click', () => { this.controller.getSimulationController().startSim() });
            div.appendChild(btn);
        }
    }

    setupLockedPieceClick(element) {
        // check if gridspot has a piece
        const id = element.id;
        const colrow = extractXYPosition(id);
        const filled = this.controller.getCurrentRegion().isFilled(colrow.col, colrow.row);

        if (filled instanceof Gridspot) {
            const gridItem = filled.getGridItem();

            if (["hogeBoom", "schaduwBoom", "bredeBoom"].indexOf(gridItem.type) == -1) {
                // gridItem instanceof GridItem &&
                element.addEventListener('click', (data) => {
                    // if has piece, show details in z index screen
                    this.buildZIndexWindow(data);
                });
            }
        }
    }

    buildZIndexWindow(data) {
        if (this.ZIndexViewShowing) {
            return;
        }
        let detailView = new DetailView(this.controller);
        detailView.buildZIndexWindow(data);
    }

    reconfigureGridElement(element) {
        element.addEventListener(
            "dragover",
            (e) => {
                this.dragDrop.dragOver(e);
            },
            false
        );
        element.addEventListener(
            "drop",
            (e) => {
                this.dragDrop.dropEvent(e);
            },
            false
        );
        element.addEventListener(
            "dragleave",
            (e) => {
                this.dragDrop.dragLeave(e);
            },
            false
        );
        element.draggable = false;
        element.className = "col dropZone";
    }

    makeGridPuzzlePiece(element) {
        element.addEventListener(
            "dragstart",
            (e) => {
                this.dragDrop.dragStart(e);
            },
            false
        );
        element.addEventListener(
            "dragend",
            (e) => {
                this.dragDrop.dragEnd(e);
            },
            false
        );
    }

    showRegion() {
        // build region menu buttons
        this.buildRegionMenuButtons();

        // create configurebtn
        let configureContainer = document.getElementById("configbtnContainer");
        let configBtn = document.createElement("button");
        configBtn.className = "btn btn-dark";
        configBtn.innerText =
            "Configureer " + this.controller.getCurrentRegion().name;
        configBtn.id = "configRegioBtn";
        configBtn.addEventListener("click", () =>
            this.controller.switchToForm(
                this.controller.getCurrentRegion().name,
                this.controller.getCurrentRegion().id
            )
        );
        configureContainer.appendChild(configBtn);

        // create lock button
        let lockBtn = document.createElement("button");
        lockBtn.className = "btn btn-warning ml-3";
        lockBtn.id = "lockRegioBtn";
        lockBtn.innerText = "Lock regio";
        lockBtn.addEventListener("click", () => {
            this.lockRegion();
        });
        configureContainer.appendChild(lockBtn);

        // create container for grid/dropzone
        let dropZoneContainer = document.createElement("div");
        dropZoneContainer.className = "row mt-3 dropZoneContainer";
        dropZoneContainer.id = "dropZoneDiv";

        // create col for pieces
        let piecesCol = document.createElement("div");
        piecesCol.className = "col-4 pieces";
        piecesCol.id = "pieces";
        let tree = document.createElement("div");
        tree.className = "row";
        tree.id = "piecesView";
        piecesCol.appendChild(tree);
        // create col for grid/dropzone and add dropzone to it
        let gridCol = document.createElement("div");
        gridCol.className = "col";
        gridCol.id = "dropZoneRowContainer";

        for (let i = 0; i < this.rows; i++) {
            let dropZoneRow = document.createElement("div");
            dropZoneRow.className = "row dropZoneRow";
            dropZoneRow.id = "row" + i.toString();
            dropZoneRow.draggable = false;

            for (let j = 0; j < this.cols; j++) {
                let dropZoneCol = document.createElement("div");
                dropZoneCol.className = "col dropZone";
                dropZoneCol.id = "col" + j + "row" + i;
                dropZoneCol.draggable = false;
                dropZoneCol.addEventListener(
                    "dragover",
                    (e) => {
                        this.dragDrop.dragOver(e);
                    },
                    false
                );
                dropZoneCol.addEventListener(
                    "drop",
                    (e) => {
                        this.dragDrop.dropEvent(e);
                    },
                    false
                );
                dropZoneCol.addEventListener(
                    "dragleave",
                    (e) => {
                        this.dragDrop.dragLeave(e);
                    },
                    false
                );

                dropZoneRow.appendChild(dropZoneCol);
            }
            gridCol.appendChild(dropZoneRow);
        }
        dropZoneContainer.appendChild(piecesCol);
        dropZoneContainer.appendChild(gridCol);

        // place everything in main container.
        let container = document.getElementsByClassName("regionsContainer");
        container[0].appendChild(dropZoneContainer);

        this.createPieces();
        this.addExistingPieces();

        if (this.controller.getCurrentRegion().isLocked) {
            this.lockRegion();
        }
    }

    updatePeople() {
        let existingCoordinates = this.controller.getCurrentRegion().gridSpots;
        existingCoordinates.forEach((row) => {
            row.forEach((col) => {
                //check amount of people
                //update view
            });
        });
    }

    addExistingPieces() {
        let existingCoordinates = this.controller.getCurrentRegion().gridSpots;
        if (existingCoordinates == null) return;

        existingCoordinates.forEach((row) => {
            row.forEach((col) => {
                let element = col.getGridItem();
                if (element) {
                    element.coordinates.forEach((e) => {
                        switch (element.type) {
                            case "tent":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "eetkraampje":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "drankkraampje":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "hogeBoom":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "bredeBoom":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "schaduwBoom":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "toilet":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            case "prullenbak":
                                this.fillFilledSpots(e.x, e.y, element.type);
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        });
    }

    // adds classes to from localstorage retrieved coordinates
    fillFilledSpots(x, y, classTypeString) {
        let xy = "col" + x + "row" + y;
        let element = document.getElementById(xy);
        let new_element = this.dragDrop.cleanElement(element);
        this.makeGridPuzzlePiece(new_element);
        new_element.draggable = true;
        new_element.classList.add(classTypeString);
    }

    createPieces() {
        let piecesCol = document.getElementById("piecesView");

        let amount = 0;

        for (let x in this.controller.getCurrentRegion().festivalItemsAmounts) {
            if (x == "hogeBoom" || x == "schaduwBoom" || x == "bredeBoom") continue;
            amount++;
            let col = document.createElement("div");
            col.classList.add("col");

            let puzzlePiece = document.createElement("div");
            puzzlePiece.draggable = true;
            puzzlePiece.innerText = this.controller.getCurrentRegion().festivalItemsAmounts[
                x
                ];
            puzzlePiece.addEventListener(
                "dragstart",
                (e) => {
                    this.dragDrop.dragStart(e);
                },
                false
            );
            puzzlePiece.addEventListener(
                "dragend",
                (e) => {
                    this.dragDrop.dragEnd(e);
                },
                false
            );

            switch (x) {
                case "tent":
                    puzzlePiece.classList.add("tent");
                    puzzlePiece.id = "tent";
                    break;
                case "eetkraampje":
                    puzzlePiece.classList.add("eetkraampje");
                    puzzlePiece.id = "eetkraampje";
                    break;
                case "drankkraampje":
                    puzzlePiece.classList.add("drankkraampje");
                    puzzlePiece.id = "drankkraampje";
                    break;
                case "hogeBoom":
                    puzzlePiece.classList.add("hogeBoom");
                    puzzlePiece.id = "hogeBoom";
                    break;
                case "schaduwBoom":
                    puzzlePiece.classList.add("schaduwBoom");
                    puzzlePiece.id = "schaduwBoom";
                    break;
                case "bredeBoom":
                    puzzlePiece.classList.add("bredeBoom");
                    puzzlePiece.id = "bredeBoom";
                    break;
                case "prullenbak":
                    puzzlePiece.classList.add("prullenbak");
                    puzzlePiece.id = "prullenbak";
                    break;
                case "toilet":
                    puzzlePiece.classList.add("toilet");
                    puzzlePiece.id = "toilet";
                    break;
                default:
                    console.log(x);
                    break;
            }
            puzzlePiece.classList.add("puzzlePiece");
            col.appendChild(puzzlePiece);
            if (amount === 3) {
                let row = document.createElement('div');
                row.classList.add("row");
                row.id = "piecesView";
                row.appendChild(col);
                const pieces = document.getElementById('pieces');
                pieces.appendChild(row);
                piecesCol = row;
                amount = 0;
            } else {
                piecesCol.appendChild(col);
            }
        }
    }

    hideView() {
        document.getElementsByClassName("regionsContainer")[0].style.display =
            "none";
    }

    showView() {
        this.cleanRegion();
        this.showRegion();
        document.getElementsByClassName("regionsContainer")[0].style.display =
            "block";
    }
}
