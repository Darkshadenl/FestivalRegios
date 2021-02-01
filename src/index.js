"use strict";

import './css/main.scss';
import './css/bootstrap.css';

import Festival from './festival';

window.onload = () => {
    
};

class Index {

    #festival;

    constructor() {
        this.#festival = new Festival();
        // this.prepareStorage();
    }

    get festival(){
        return this.#festival;
    }

    set festival(mag){
        this.#festival = mag;
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
index.festival = new Festival();
console.log(index.magazijn);
console.log(index.anders);


// function changeScreen(){

//     let newProduct = document.getElementById('new_products_button');
//     let choice_menu = document.getElementById('dropdownMenuButton');

//     newProduct.innerText = `Nieuwe ${index.magazijn.current.screenName} menu`;
//     choice_menu.innerText = index.magazijn.current.screenName;

//     index.magazijn.current.createDropDownMenu();
// }

