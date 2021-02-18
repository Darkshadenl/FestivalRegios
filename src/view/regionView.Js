import regionController from "../controllers/regionController";
import DragDrop from "../view/DragDrop";

export default class regionView {

  element;
  regions;
  controller;
  #dragDrop;
  rows = 15;
  cols = 15;

  constructor(controller) {
    this.controller = controller;
    this.#dragDrop = new DragDrop(controller, this);
  }

  buildRegionMenuButtons() {
    let regionMenu = document.getElementById("regionMenu");
    let buttons = [];
    let viewNames = [];

    let regionModels = this.controller.festival.regions;

    regionModels.forEach(model => {
      viewNames.push(model.name);
    })

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

      if (button.innerText == this.controller.current_region.name) {
        button.classList.remove("btn-info");
        button.classList.add("btn-primary");
      }
      buttons.push(button);
    });

    let deleteBox = document.createElement('div');
    deleteBox.innerText = 'Sleep hier naartoe om te verwijderen';
    deleteBox.className = 'mt-2 deleteBox';
    deleteBox.id = 'deleteBox';
    deleteBox.addEventListener('dragover', (e) => { this.#dragDrop.dragOver(e) }, false);
    // deleteBox.addEventListener('dragleave', (e) => { this.#dragDrop.dragLeaveDeleteBox(e) }, false);
    deleteBox.addEventListener('drop', (e) => { this.#dragDrop.deleteBoxDrop(e) }, false)

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

    let configbtnContainer = document.getElementById("configbtnContainer");
    while (configbtnContainer.firstChild) {
      configbtnContainer.removeChild(configbtnContainer.lastChild);
    }

  }

  lockRegion() {
    this.controller.current_region.lockRegion();
    this.controller.UpdateLocalStorage();
    let pieces = document.getElementById('piecesView');
    let gridpieces = document.getElementById('dropZoneRowContainer');
    let lockbtn = document.getElementById('lockRegioBtn');

    pieces.childNodes.forEach(e => {
      if (e.hasChildNodes) {
        e.childNodes.forEach(f => {
          f.draggable = false;
        })
      }
    })

    gridpieces.childNodes.forEach(e => {
      if (e.hasChildNodes) {
        e.childNodes.forEach(f => {
          f.draggable = false;
        })
      }
    })

    lockbtn.innerText = 'Regio gelocked';
  }

  reconfigureGridElement(element) {
    element.addEventListener("dragover", (e) => { this.#dragDrop.dragOver(e) }, false);
    element.addEventListener("drop", (e) => { this.#dragDrop.dropEvent(e) }, false);
    element.addEventListener("dragleave", (e) => { this.#dragDrop.dragLeave(e) }, false);
    element.draggable = false;
    element.className = "col dropZone";
  }

  makeGridPuzzlePiece(element) {
    element.addEventListener("dragstart", (e) => { this.#dragDrop.dragStart(e) }, false);
    element.addEventListener("dragend", (e) => { this.#dragDrop.dragEnd(e) }, false);
  }

  showRegion() {
    // build region menu buttons
    this.buildRegionMenuButtons();

    // create configurebtn
    let configureContainer = document.getElementById("configbtnContainer");
    let configBtn = document.createElement("button");
    configBtn.className = "btn btn-dark";
    configBtn.innerText = "Configureer " + this.controller.current_region.name;
    configBtn.id = "configRegioBtn";
    configBtn.addEventListener("click", () =>
      this.controller.mainController.switchToForm(this.controller.current_region.name, this.controller.current_region.id)
    );
    configureContainer.appendChild(configBtn);

    // create lock button
    let lockBtn = document.createElement('button');
    lockBtn.className = "btn btn-warning ml-3";
    lockBtn.id = 'lockRegioBtn';
    lockBtn.innerText = 'Lock regio';
    lockBtn.addEventListener('click', () => {
      this.lockRegion();
    });
    configureContainer.appendChild(lockBtn);

    // create container for grid/dropzone
    let dropZoneContainer = document.createElement("div");
    dropZoneContainer.className = "row mt-3 dropZoneContainer";

    // create col for pieces
    let piecesCol = document.createElement("div");
    piecesCol.className = "col-4 pieces";
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
        dropZoneCol.id = "col" + j + 'row' + i;
        dropZoneCol.draggable = false;
        dropZoneCol.addEventListener("dragover", (e) => { this.#dragDrop.dragOver(e) }, false);
        dropZoneCol.addEventListener("drop", (e) => { this.#dragDrop.dropEvent(e) }, false);
        dropZoneCol.addEventListener("dragleave", (e) => { this.#dragDrop.dragLeave(e) }, false);

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

    if (this.controller.current_region.isLocked) {
      this.lockRegion();
    }
  }

  addExistingPieces() {
    let existingCoordinates = this.controller.current_region.gridSpots;
    if (existingCoordinates == null) return;

    existingCoordinates.forEach(row => {
      row.forEach(col => {
        let element = col.getGridItem();
        if (element) {
          element.coordinates.forEach(e => {
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
              case "boom":
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
          })
        }
      })
    });
  }

  // adds classes to from localstorage retrieved coordinates
  fillFilledSpots(x, y, classTypeString) {
    let xy = 'col' + x + 'row' + y;
    let element = document.getElementById(xy);
    let new_element = this.#dragDrop.cleanElement(element);
    this.makeGridPuzzlePiece(new_element);
    new_element.draggable = true;
    new_element.classList.add(classTypeString);
  }

  createPieces() {
    let piecesCol = document.getElementById("piecesView");

    for (let x in this.controller.current_region.festivalItemsAmounts) {
      if (x == 'prullenbak') continue;
      let col = document.createElement("div");
      col.classList.add("col");
      let puzzlePiece = document.createElement("div");
      puzzlePiece.draggable = true;
      puzzlePiece.innerText = this.controller.current_region.festivalItemsAmounts[x];
      puzzlePiece.addEventListener("dragstart", (e) => { this.#dragDrop.dragStart(e) }, false);
      puzzlePiece.addEventListener("dragend", (e) => { this.#dragDrop.dragEnd(e) }, false);

      switch (x) {
        case "tent":
          puzzlePiece.classList.add("tent");
          puzzlePiece.id = 'tent';
          break;
        case "eetkraampje":
          puzzlePiece.classList.add("eetkraampje");
          puzzlePiece.id = 'eetkraampje';
          break;
        case "drankkraampje":
          puzzlePiece.classList.add("drankkraampje");
          puzzlePiece.id = 'drankkraampje';
          break;
        case "boom":
          puzzlePiece.classList.add("boom");
          puzzlePiece.id = 'boom';
          break;
        case "toilet":
          puzzlePiece.classList.add("toilet");
          puzzlePiece.id = 'toilet';
          break;
        default:
          console.log(x);
          break;
      }
      puzzlePiece.classList.add('puzzlePiece');
      col.appendChild(puzzlePiece);
      piecesCol.appendChild(col);
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
