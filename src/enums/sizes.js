"use strict"

export { Sizes as default }

const Sizes = {
    tent: {
        width: 3,
        height: 3,
    },
    eetkraampje: {
        width: 1,
        height: 1,
    },
    drankkraampje: {
        width: 2,
        height: 1,
    },
    hogeBoom: {
        width: 1,
        height: 1,
    },
    bredeBoom: {
        width: 1,
        height: 2,
    },
    schaduwBoom: {
        width: 3,
        height: 3,
    },
    toilet: {
        width: 1,
        height: 3,
    },
    prullenbak: {
        width: 1,
        height: 3,
    },
    surface: function (category) {
        let cat = category.toString();
        return parseInt(this[category].width * this[category].height);
    }
}

Object.freeze(Sizes);


