export default class formController {

    constructor(){
        
    }

    showView(regionName){
        let formScreen = document.getElementsByClassName("formScreen")[0].style.display = "inline";
        let title = document.getElementById("formTitle");
        title.innerText = "Formulier voor " + regionName;
        let form = document.getElementById("form")
        
    }

}