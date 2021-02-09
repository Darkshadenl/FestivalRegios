import regionController from "../controllers/regionController";

export default class regionView {
  id;
  name;
  element;
  regions;
  controller;
  active = false;

  tenten = 0;
  eetkraampjes = 0;
  drankkraampjes = 0;
  bomen = 0;
  toiletten = 0;

  festivalItemsAmounts = {
    tenten: 0,
    eetkraampjes: 0,
    drankkraampjes: 0,
    bomen: 0,
    toiletten: 0,
  };

  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.retrieveDataFromLocalStorage();
  }

  retrieveDataFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem(this.id));
    if (data == null) return;
    this.name = data[0];
    this.tenten = data[1];
    this.eetkraampjes = data[2];
    this.drankkraampjes = data[3];
    this.bomen = data[4];
    this.toiletten = data[5];

    this.festivalItemsAmounts.tenten = data[1];
    this.festivalItemsAmounts.eetkraampjes = data[2];
    this.festivalItemsAmounts.drankkraampjes = data[3];
    this.festivalItemsAmounts.bomen = data[4];
    this.festivalItemsAmounts.toiletten = data[5];
  }

  buildRegionMenuButtons() {
    let regionMenu = document.getElementById("regionMenu");
    let buttons = [];
    let viewNames = [];
    let int;
    this.regions.forEach((view) => {
      viewNames.push(view.name);
    });

    viewNames.forEach((name) => {
      let button = document.createElement("button");
      button.className = "btn btn-info ml-2";
      button.innerText = name;
      button.addEventListener("click", () => {
        this.regions.forEach((region) => {
          if (region.name == button.innerText) {
            region.switchRegion();
          }
        });
      });

      if (button.innerText == this.name) {
        button.classList.remove("btn-info");
        button.classList.add("btn-primary");
      }
      buttons.push(button);
    });

    buttons.forEach((e) => {
      regionMenu.appendChild(e);
    });
  }

  switchRegion() {
    // clean data of current region
    this.active = false;
    this.cleanRegion();
    // show new region
    this.showRegion();
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
    let configbtn = document.getElementById("configRegioBtn");
    configbtn.remove();
  }

  showRegion() {
    // Retrieve data from localstorage.
    this.retrieveDataFromLocalStorage();
    // build region menu buttons
    this.buildRegionMenuButtons();

    // create configurebtn
    let configureContainer = document.getElementById("configbtnContainer");
    let configBtn = document.createElement("button");
    configBtn.className = "btn btn-dark";
    configBtn.innerText = "Configureer " + this.name;
    configBtn.id = "configRegioBtn";
    configBtn.addEventListener("click", () =>
      this.controller.mainController.switchToForm(this.name, this.id)
    );
    configureContainer.appendChild(configBtn);

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

    for (let i = 0; i < 15; i++) {
      let dropZoneRow = document.createElement("div");
      dropZoneRow.className = "row dropZoneRow";
      dropZoneRow.id = "row" + i.toString();

      for (let i = 0; i < 15; i++) {
        let dropZoneCol = document.createElement("div");
        dropZoneCol.className = "col dropZone";
        dropZoneCol.id = "col" + i.toString();

        dropZoneCol.addEventListener("dragover", this.dragOver, false);
        dropZoneCol.addEventListener("dragenter", this.dragEnter, false);
        dropZoneCol.addEventListener("drop", this.dropEvent, false);
        dropZoneCol.addEventListener("dragleave", this.dragLeave, false);

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
    this.active = true;
  }

  createPieces() {
    let piecesCol = document.getElementById("piecesView");

    // create example pieces
    // let tree = document.createElement('div')
    // tree.classList.add('tree')
    // tree.draggable = true;
    // tree.innerText = 3;
    // tree.style = 'color: orange';
    // tree.addEventListener("dragstart", this.dragStart, false);

    for (let x in this.festivalItemsAmounts) {
      console.log(x);
      console.log(this.festivalItemsAmounts[x]);

      let col = document.createElement('div');
      col.classList.add('col');
      let puzzlePiece = document.createElement('div');
      puzzlePiece.draggable = true;
      puzzlePiece.innerText = this.festivalItemsAmounts[x];
      puzzlePiece.addEventListener("dragstart", this.dragStart, false);

      switch (x) {
        case "tenten":
          puzzlePiece.classList.add('tent')
          break;
        case "eetkraampjes":
          puzzlePiece.classList.add('eetkraampje')
          break;
        case "drankkraampjes":
          puzzlePiece.classList.add('drankkraampje')
          break;
        case "bomen":
          puzzlePiece.classList.add('boom')
          break;
        case "toiletten":
          puzzlePiece.classList.add('toilet')
          break;
          case "prullenbak":
          puzzlePiece.classList.add('toilet')
          break;
      }
      col.appendChild(puzzlePiece);
      piecesCol.appendChild(col);
    }
  }

  hideView() {
    document.getElementsByClassName("regionsContainer")[0].style.display =
      "none";
  }

  showView() {
    this.retrieveDataFromLocalStorage();
    this.cleanRegion();
    this.showRegion();
    document.getElementsByClassName("regionsContainer")[0].style.display =
      "block";
  }

  // draggable start
  dragStart(e) {
    e.dataTransfer.setData("type", e.target.classList[0]);
    e.dataTransfer.setData("amountLeft", e.target.innerText);
  }

  // target dragOver
  dragOver(e) {
    e.preventDefault();
    if (e.target.classList.contains("dropZone")) {
      e.target.classList.add("solid-border");
    }
  }

  dragLeave(e) {
    e.target.classList.remove("solid-border");
  }

  dragEnter(e) {}

  dropEvent(e) {
    e.preventDefault();
    e.target.classList.remove("solid-border");
    let draggableType = e.dataTransfer.getData("type");

    switch (draggableType) {
      case "tent":
        e.target.classList.add("tent");
        break;
      case "eetkraampje":
        e.target.classList.add("eetkraampje");
        break;
      case "drankkraampje":
        e.target.classList.add("drankkraampje");
        break;
      case "boom":
        e.target.classList.add("boom");
        break;
      case "toilet":
        e.target.classList.add("toilet");
        break;
      case "prullenbak":
        e.target.classList.add("prullenbak");
        break;
    }
  }
}
