"use strict";

import './css/main.scss';
import './css/bootstrap.css';

import mainController from './controllers/MainController';

// window.onload = () => {
    
// };

class Index {

    mainController;

    constructor() {
        this.mainController = new mainController();
    }

}

const index = new Index();

