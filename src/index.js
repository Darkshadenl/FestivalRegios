"use strict";

import './css/main.scss';
import './css/bootstrap.css';

import mainController from './controllers/mainController';

window.onload = () => {
    
};

class Index {

    #mainController;

    constructor() {
        this.#mainController = new mainController();
        // this.prepareStorage();
    }

    // prepareStorage() {
    //     fetch('./src/resources/defaultData.json')
    //         .then((response) => {
    //             return response.json();
    //         }).then((data) => {
    //         localStorage.setItem("items", JSON.stringify(data));
    //     });
    // }

}

const index = new Index();

// function changeScreen(){

//     let newProduct = document.getElementById('new_products_button');
//     let choice_menu = document.getElementById('dropdownMenuButton');

//     newProduct.innerText = `Nieuwe ${index.magazijn.current.screenName} menu`;
//     choice_menu.innerText = index.magazijn.current.screenName;

//     index.magazijn.current.createDropDownMenu();
// }

