import regionController from "../controllers/regionController";

export default class regionView {
  name;
  element;
  regions;
  controller;
  active = false;

  constructor(name) {
    this.name = name;
  }

  buildRegionMenuButtons(){
    let regionMenu = document.getElementById('regionMenu');
    let buttons = [];

    for (let index = 1; index < 7; index++) {
      let button = document.createElement('button');
      button.className = "btn btn-info ml-2";
      button.innerText = "Regio " + index;
      button.addEventListener('click', () => { 
        this.regions.forEach(element => {
          if (element.name == button.innerText){
            element.switchRegion();
          }
        });
      })

      if (button.innerText == this.name){
        button.classList.remove('btn-info');
        button.classList.add('btn-primary');
      }
      buttons.push(button);
    }

    buttons.forEach(e => {
      regionMenu.appendChild(e);
    })
  }

  switchRegion(){
    // clean data of current region
    this.active = false;
    let dropzoneContainer = document.getElementsByClassName('dropZoneContainer');
    dropzoneContainer[0].remove();
    let regionMenuButtons = document.getElementById('regionMenu');
    while(regionMenuButtons.firstChild){
      regionMenuButtons.removeChild(regionMenuButtons.lastChild);
    }
    let configbtn = document.getElementById("configRegioBtn");
    configbtn.remove();

    // show new region
    this.showRegion();
  }

  showRegion() {
    // build region menu buttons
    this.buildRegionMenuButtons()

    // create configurebtn
    let configureContainer = document.getElementById("configbtnContainer")
    let configBtn = document.createElement("button");
    configBtn.className = "btn btn-dark";
    configBtn.innerText = "Configureer regio";
    configBtn.id = "configRegioBtn";
    configBtn.addEventListener('click', () => this.controller.mainController.switchToForm(this.name));
    configureContainer.appendChild(configBtn);

    // create container for grid/dropzone
    let dropZoneContainer = document.createElement("div");
    dropZoneContainer.className = "row mt-3 dropZoneContainer";

    // create col for pieces
    let piecesCol = document.createElement("div");
    piecesCol.className = "col-4 pieces";
    let tree = document.createElement("div");
    tree.className = "row";
    tree.id = 'piecesView';
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

        dropZoneCol.addEventListener('dragover', this.dragOver, false);
        dropZoneCol.addEventListener('dragenter', this.dragEnter, false);
        dropZoneCol.addEventListener('drop', this.dropEvent, false);
        dropZoneCol.addEventListener('dragleave', this.dragLeave, false);

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
    let tree = document.createElement('div')
    tree.classList.add('tree')
    tree.draggable = true;
    tree.addEventListener("dragstart", this.dragStart, false);
    
    piecesCol.appendChild(tree);
  }

  hideView(){
    document.getElementsByClassName('regionsContainer')[0].style.display = 'none';
  }

  showView(){
    document.getElementsByClassName('regionsContainer')[0].style.display = 'block';
  }

  // draggable start
  dragStart(e) {
    e.dataTransfer.setData('type', e.target.classList[0])
  }

  // target dragOver
  dragOver(e) {
    e.preventDefault();
    if (e.target.classList.contains('dropZone')){
        e.target.classList.add('solid-border')
    }
  }

  dragLeave(e) {
    e.target.classList.remove('solid-border')
  }

  dragEnter(e) {
    
  }

  dropEvent(e) {
    e.preventDefault();
    e.target.classList.remove('solid-border')

    let draggableType = e.dataTransfer.getData('type')

    switch (draggableType){
        case 'tent':
            e.target.classList.add('tent')
            break;
        case 'eetkraampje':
            e.target.classList.add('eetkraampje')
            break;
        case 'drankkraampje':
            e.target.classList.add('drankkraampje')
            break;
        case 'tree':
            e.target.classList.add('boom')
            break;
        case 'toilet':
            e.target.classList.add('toilet')
            break;
        case 'prullenbak':
            e.target.classList.add('prullenbak')
            break;
    }

  }

}
