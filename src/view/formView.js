export default class formView {
  name;
  controller;
  formScreen;
  form;
  formContainer;
  active = false;
  id;

  details = [
    "Tenten",
    "Eetkraampjes",
    "Drankkraampjes",
    "Bomen",
    "Toiletten",
    "Prullenbakken",
  ];

  limits = [10, 6, 4, 10, 5, undefined];
  tentenNumberBox;
  formfields = [];
  iterator = 0;

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  showView(){
    this.active = true;
    this.formScreen = document.getElementsByClassName("formScreen")[0];
    this.formScreen.style.display = "inline";
    let title = document.getElementById("formTitle");
    title.innerText = "Formulier voor " + this.name;

    this.formContainer = document.getElementById("formContainer");
    this.form = document.getElementById("form");

    // backbtn config
    let backBtn = document.getElementById("backToRegionBtn");
    backBtn.addEventListener("click", () =>
      this.controller.mainController.switchToRegions(this.id)
    );
    backBtn.innerText = "Terug naar " + this.name;

    let textBoxName = document.createElement("input");
    let textBoxLabl = document.createElement("label");

    textBoxLabl.innerText = "Naam regio: ";
    textBoxName.id = "nameRegion";
    textBoxName.type = "text";
    textBoxName.minLength = 1;
    textBoxName.required = true;
    textBoxLabl.setAttribute("for", "nameRegion");
    textBoxName.className = "ml-2";
    this.form.appendChild(textBoxLabl);
    this.form.appendChild(textBoxName);
    this.formfields.push(textBoxName);

    // next btn
    let resBtn = this.createResBtn();
    let nextBtn = this.createNextBtn();
    this.formContainer.appendChild(nextBtn);
    this.formContainer.appendChild(resBtn);
  }

  upIterator() {
    if (this.iterator < this.details.length) {
      let numberBox = document.createElement("input");
      let textBoxLabl = document.createElement("label");

      textBoxLabl.innerText = this.details[this.iterator] + ":";
      textBoxLabl.className = "ml-2";
      numberBox.id = this.details[this.iterator];
      numberBox.type = "number";
      numberBox.min = "0";
      numberBox.required = true;

      if (this.limits[this.iterator] != undefined) {
        // check for tents. If a tent is 'placed', change the limits.
        if (this.iterator == 1) {
          let tentenBox = document.getElementById("Tenten");
          tentenBox.addEventListener("change", () => {
            this.handleTentChanges();
          });
        }
        numberBox.max = this.limits[this.iterator];
      }
      textBoxLabl.setAttribute("for", this.details[this.iterator]);
      numberBox.className = "ml-2";

      this.form.appendChild(textBoxLabl);
      this.form.appendChild(numberBox);
      this.formfields.push(numberBox);
      this.iterator = this.iterator + 1;
    } else {
      let next = document.getElementById("nextBtn");
      next.remove();
      let finish = document.createElement("button");
      finish.innerText = "Afronden";
      finish.id = "finish";
      finish.addEventListener("click", () => {
        this.saveForm();
      });
      this.formContainer.appendChild(finish);
    }
  }

  saveForm() {
    let faulty = false;
    this.formfields.forEach((e) => {
      if (!e.checkValidity())
        faulty = true;
    }) 
    if (faulty)
      window.alert(
        "Opslaan is niet gelukt. Probeer de waardes naar onder bij te stellen of de lege velden te vullen."
      );
    if (!faulty) {
      // save form.
      let allInputs = document.querySelectorAll('#form input');
      let values = [];
      allInputs.forEach(e => {
        values.push(e.value);
      })
      this.controller.saveData(this.id, values)
      this.controller.mainController.switchToRegions(this.id)
      window.alert('Succesvol opgeslagen');
    }
  }

  handleTentChanges() {
    let tentenAmount = document.getElementById("Tenten").value;
    let eetKraampjes = document.getElementById("Eetkraampjes");
    let drankKraampjes = document.getElementById("Drankkraampjes");
    if (tentenAmount > 0) {
      this.limits[1] = 3; // eetkraampjes
      this.limits[2] = 2; // drankkraampjes
    }
    if (tentenAmount == 0) {
      this.limits[1] = 6; // eetkraampjes
      this.limits[2] = 4; // drankkraampjes
    }
    if (eetKraampjes) eetKraampjes.max = this.limits[1];
    if (drankKraampjes) drankKraampjes.max = this.limits[2];
  }

  createNextBtn() {
    let nextBtn = document.createElement("button");
    nextBtn.innerText = "Volgende";
    nextBtn.id = "nextBtn";
    nextBtn.addEventListener("click", () => {
      this.upIterator();
    });
    return nextBtn;
  }

  createResBtn(){
    let resBtn = document.createElement("button");
    resBtn.innerText = "Reset";
    resBtn.id = "ResetBtn";
    resBtn.addEventListener("click", () => {
      this.handleReset();      
    });
    return resBtn;
  }

  handleReset(){
    this.hideView();
    this.controller.showView(this.name, this.name);
  }

  hideView() {
    this.active = false;
    this.formScreen.style.display = "none";
    let nextBtn = document.getElementById("nextBtn");
    let saveBtn = document.getElementById("finish");
    let resBtn = document.getElementById('ResetBtn');
    this.iterator = 0;
    if (saveBtn) {
      saveBtn.remove();
    }
    if (nextBtn) {
      nextBtn.remove();
    }
    if (resBtn)
      resBtn.remove();
    while (this.form.firstChild) {
      this.form.removeChild(this.form.lastChild);
    }
  }
}
