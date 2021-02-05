export default class formView {
  name;
  controller;
  formScreen;
  form;
  formContainer;
  active = false;

  details = {
    "Tenten": 25,
    "Eetkraampjes": 6,
    "Drankkraampjes": 4,
    "Bomen": 20,
    "Toiletten": 5,
    "Prullenbakken": Infinity,
  };
  iterator = 0;
 
  constructor(name) {
    this.name = name;
  }

  showView() {
    this.active = true;
    this.formScreen = document.getElementsByClassName("formScreen")[0];
    console.log(this.formScreen);
    this.formScreen.style.display = "inline";
    let title = document.getElementById("formTitle");
    title.innerText = "Formulier voor " + this.name;

    this.formContainer = document.getElementById("formContainer")
    this.form = document.getElementById("form");

    // backbtn config
    let backBtn = document.getElementById("backToRegionBtn");
    backBtn.addEventListener("click", () =>
      this.controller.mainController.switchToRegions(this.name)
    );
    backBtn.innerText = "Terug naar " + this.name;

    let textBoxName = document.createElement("input");
    let textBoxLabl = document.createElement("label");

    textBoxLabl.innerText = "Naam regio: ";
    textBoxName.id = "nameRegion";
    textBoxName.type = "text";
    textBoxLabl.setAttribute("for", "nameRegion");
    textBoxName.className = "ml-2";
    this.form.appendChild(textBoxLabl);
    this.form.appendChild(textBoxName);

    // next btn
    let nextBtn = this.createNextBtn();
    this.formContainer.appendChild(nextBtn);
  }

  upIterator() {
    if (this.iterator < this.details.length - 1) {
      let textBoxName = document.createElement("input");
      let textBoxLabl = document.createElement("label");
      this.iterator = this.iterator + 1;

    for (let [id, value] in Object.entries(this.details)){
        console.log(id);
        console.log(value);
    }


      textBoxLabl.innerText = this.details[this.iterator] + ":";
      textBoxLabl.className = 'ml-2'
      textBoxName.id = this.details[this.iterator];
      textBoxName.type = "number";
      textBoxLabl.setAttribute("for", this.details[this.iterator]);
      textBoxName.className = "ml-2";
      this.form.appendChild(textBoxLabl);
      this.form.appendChild(textBoxName);
    } else {
        let next = document.getElementById('nextBtn');
        next.remove();
        let finish = document.createElement('button');
        finish.innerText = 'Afronden';
        finish.addEventListener('click', () => { // stuff 
        })
        this.formContainer.appendChild(finish);
    }
  }

  createNextBtn() {
    let nextBtn = document.createElement("button");
    nextBtn.innerText = "Volgende";
    nextBtn.id = 'nextBtn';
    nextBtn.addEventListener("click", () => {
      this.upIterator();
    });
    return nextBtn;
  }

  hideView() {
    this.active = false;
    this.formScreen.style.display = "none";
    let nextBtn = document.getElementById('nextBtn');
    nextBtn.remove();
    while(this.form.firstChild){
        this.form.removeChild(this.form.lastChild);
    }
  }
}
