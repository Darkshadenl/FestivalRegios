"use strict";

import './css/main.scss';
import './css/bootstrap.css';

import Magazijn from "./magazijn";
// import DragDrop from "./DragDrop";

window.onload = () => {
    document.getElementById('kleding_id').onclick = changeScreen;
    document.getElementById('tier_id').onclick = changeScreen;
    document.getElementById('decoratie_id').onclick = changeScreen;
};

class Index {

    #magazijn;
    #anders;

    constructor() {
        this.#magazijn = new Magazijn();
        this.#anders = 12;
        this.prepareStorage();
    }

    get magazijn(){
        return this.#magazijn;
    }

    set magazijn(mag){
        this.#magazijn = mag;
    }

    get anders(){
        return this.#anders;
    }

    prepareStorage() {
        fetch('./src/resources/defaultData.json')
            .then((response) => {
                return response.json();
            }).then((data) => {
            localStorage.setItem("items", JSON.stringify(data));
        });
    }

}

const index = new Index();
index.magazijn = new Magazijn();
console.log(index.magazijn);
console.log(index.anders);


function changeScreen(){

    let newProduct = document.getElementById('new_products_button');
    let choice_menu = document.getElementById('dropdownMenuButton');

    newProduct.innerText = `Nieuwe ${index.magazijn.current.screenName} menu`;
    choice_menu.innerText = index.magazijn.current.screenName;

    index.magazijn.current.createDropDownMenu();
}

