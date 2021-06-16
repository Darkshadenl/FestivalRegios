import DragDrop from "./DragDrop";
import extractXYPosition from "../helpers/extractXYPosition"
import DetailView from "./DetailView";
import Gridspot from "../model/Gridspot";
import {contains, forEach, pluck, without} from "underscore";
import {superVerbose, verbose} from "../helpers/logger";

export default class RegionView {
    element;
    regions;
    regionController;
    dragDrop;
    rows = 15;
    cols = 15;
    ZIndexViewShowing = false;
    dropAudio = new Audio("../resources/drop_sound.mp3");
    mouseAudio = new Audio("../resources/mouse-click.mp3");

    classes = ["group1", "group2", "group3", "group4", "group5", "group6", "group7"];

    constructor(controller) {
        this.regionController = controller;
        this.dragDrop = new DragDrop(controller, this);
    }

    buildRegionMenuButtons() {
        let regionMenu = document.getElementById("regionMenu");
        let buttons = [];
        let viewNames = this.regionController.getRegionNames();

        viewNames.forEach((name) => {
            let button = document.createElement("button");
            button.className = "btn btn-info ml-2";
            button.innerText = name.toString();
            button.addEventListener("click", () => {
                this.mouseAudio.play();
                viewNames.forEach((name) => {
                    if (name === button.innerText) {
                        this.regionController.switchRegion(this.regionController.getRegionByName(name).id);
                    }
                });
            });

            if (button.innerText === this.regionController.getCurrentRegionName()) {
                button.classList.remove("btn-info");
                button.classList.add("btn-primary");
            }
            buttons.push(button);
        });
        let deleteBox = this.BuildDeleteBox();

        buttons.forEach((e) => {
            regionMenu.appendChild(e);
        });
        regionMenu.appendChild(deleteBox);
    }

    BuildDeleteBox() {
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
        deleteBox.addEventListener(
            "drop",
            (e) => {
                this.dropAudio.play();
                this.dragDrop.deleteBoxDrop(e);
            },
            false
        );
        return deleteBox;
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
        this.regionController.lockCurrentRegion();
        this.regionController.UpdateLocalStorage();
        let pieces = document.getElementById("piecesView");
        let gridpieces = document.getElementById("dropZoneRowContainer");
        let lockbtn = document.getElementById("lockRegioBtn");
        const canvasDiv = document.createElement("div");
        canvasDiv.className = "mt-4";
        canvasDiv.id = "canvasDiv";
        const piecesDiv = document.getElementById("pieces");
        piecesDiv.appendChild(canvasDiv);
        const startSimBtn = document.createElement("btn");
        startSimBtn.className = "ml-4 btn btn-success";
        startSimBtn.setAttribute('data-cy', 'startSim');
        startSimBtn.innerText = "Start sim";
        startSimBtn.id = "startSim";
        startSimBtn.addEventListener("click", () => {
            this.regionController.startSim()
        });
        const api = document.getElementById("api");
        api.appendChild(startSimBtn);

        this.DisableDraggables(pieces);
        this.disableAndSetupPlacedPieces(gridpieces);

        lockbtn.innerText = "Regio gelocked";
        lockbtn.disabled = true;
    }

    disableAndSetupPlacedPieces(gridPieces) {
        gridPieces.childNodes.forEach((e) => {
            if (e.hasChildNodes) {
                e.childNodes.forEach((f) => {
                    f.draggable = false;
                    this.setupLockedPieceClick(f);
                });
            }
        });
    }

    DisableDraggables(pieces) {
        pieces.childNodes.forEach((e) => {
            if (e.hasChildNodes) {
                e.childNodes.forEach((f) => {
                    f.draggable = false;
                });
            }
        });
    }

    changeButton(started) {
        const div = document.getElementById("api");
        const btn = document.createElement("btn");
        if (started) {
            document.getElementById("startSim").remove();
            btn.className = "ml-4 btn btn-danger";
            btn.innerText = "Stop sim";
            btn.id = "stopSim";
            btn.addEventListener('click', () => {
                this.regionController.resetSim()
            });
            div.appendChild(btn);
        } else {
            document.getElementById("stopSim").remove();
            btn.className = "ml-4 btn btn-success";
            btn.innerText = "Start sim";
            btn.id = "startSim";
            btn.addEventListener('click', () => {
                this.regionController.startSim()
            });
            div.appendChild(btn);
        }
    }

    setupLockedPieceClick(element) {
        // check if gridspot has a piece
        const id = element.id;
        const colrow = extractXYPosition(id);
        const filled = this.regionController.isCurrentRegionFilled(colrow.col, colrow.row);

        if (filled instanceof Gridspot) {
            const gridItem = filled.getGridItem();

            if (["hogeBoom", "schaduwBoom", "bredeBoom"].indexOf(gridItem.type) == -1) {
                // gridItem instanceof GridItem &&
                element.addEventListener('click', (data) => {
                    // if has piece, show details in z index screen
                    superVerbose(data);
                    this.buildZIndexWindow(data);
                });
            }
        }
    }

    buildZIndexWindow(data) {
        if (this.ZIndexViewShowing) {
            return;
        }
        let detailView = new DetailView(this.regionController);
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
            "Configureer " + this.regionController.getCurrentRegionName();
        configBtn.id = "configRegioBtn";
        configBtn.addEventListener("click", () =>
            this.regionController.switchToForm(
                this.regionController.getCurrentRegionName(),
                this.regionController.getCurrentRegionId(),
            )
        );
        configureContainer.appendChild(configBtn);

        // create lock button
        let lockBtn = document.createElement("button");
        lockBtn.className = "btn btn-warning ml-3";
        lockBtn.id = "lockRegioBtn";
        lockBtn.innerText = "Lock regio";
        if (this.regionController.isCurrentRegionLocked()){
            lockBtn.innerText = "Regio gelocked";
        } else {
            lockBtn.addEventListener("click", () => {
                this.lockRegion();
            });
        }

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

        this.regionController.createPieces();
        this.addExistingPieces();

        if (this.regionController.isCurrentRegionLocked()) {
            this.lockRegion();
        }
    }

    addExistingPieces() {
        let existingCoordinates = this.regionController.getCurrentRegionGridSpots();
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

    createPiece(festivalItem) {
        let piecesCol = document.getElementById("piecesView");
        if (festivalItem === "hogeBoom" || festivalItem === "schaduwBoom" || festivalItem === "bredeBoom") return;

        let col = document.createElement("div");
        let puzzlePiece = document.createElement("div");

        col.className = "col";
        let amount = this.regionController.getCurrentRegionFestivalItemAmount(festivalItem);
        puzzlePiece.innerText = amount;
        puzzlePiece.draggable = amount > 0;
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
        this.assignClassToPuzzlePiece(festivalItem, puzzlePiece);
        puzzlePiece.classList.add("puzzlePiece");
        col.appendChild(puzzlePiece);
        piecesCol.appendChild(col);
    }

    assignClassToPuzzlePiece(x, puzzlePiece) {
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

    updateSim(gridSpot) {
        let xy = this.formattedXY(gridSpot);
        let element = document.getElementById(xy);
        this.changeGroupPicLocation(gridSpot, element);
    }

    cleanupSimItem(gridSpot) {
        let xy = this.formattedXY(gridSpot);
        let element = document.getElementById(xy);
        forEach(this.classes, (e) => {
            element.classList.toggle(e, false);
        })
    }

    changeGroupPicLocation(gridSpot, element) {
        let pAmount = gridSpot.getCountPeople();
        let chosenClass = "";

        if (gridSpot.gridItem === null || !contains(["prullenbak", "eetkraampje", "drankkraampje",
            "hogeBoom", "bredeBoom", "schaduwBoom", "tent", "toilet"], gridSpot.gridItem.type)) {
            chosenClass = this.determinePAmount(pAmount, chosenClass);
        }

        let notSelectedClasses = without(this.classes, chosenClass);
        if (chosenClass !== "") {
            element.classList.toggle(chosenClass, true);
            forEach(notSelectedClasses, c => element.classList.toggle(c, false));
        } else {
            forEach(this.classes, c => element.classList.toggle(c, false));
        }
    }

    determinePAmount(pAmount, chosenClass) {
        switch (pAmount) {
            case 1:
                chosenClass = "group1";
                break;
            case 2:
                chosenClass = "group2";
                break;
            case 3:
                chosenClass = "group3";
                break;
            case 4:
                chosenClass = "group4";
                break;
            case 5:
                chosenClass = "group5";
                break;
            case 6:
                chosenClass = "group6";
                break;
            case 7:
                chosenClass = "group7";
                break;
            default:
                chosenClass = "";
        }
        return chosenClass;
    }

    flash(item, isGridItem) {
        let element = document.getElementById(`col${item.x}row${item.y}`);

        if (isGridItem) {
            if (item.type === "tent")
                element.classList.toggle("tentFlash", true);
            else
                element.classList.toggle("toiletFlash", true);
        } else {
            if (item.should_flash)
                element.classList.toggle("flash", true);
        }
        setTimeout(() => {
            element.classList.toggle("flash", false);
            element.classList.toggle("tentFlash", false);
            element.classList.toggle("toiletFlash", false);
        }, 500);
    }

    formattedXY({x, y}) {
        return 'col' + x + 'row' + y;
    }
}
