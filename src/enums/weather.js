"use strict"

export { Weather as default }

const Weather = {
    NONE: 1,
    BEWOLKT: 2,
    REGEN: 3,
    MIST: 4,
    HELDER: 5,
    SNEEUW: 6,
    properties: {
        1: { name: 'NONE' },
        2: { name: 'Bewolkt' },
        3: { name: 'Regen' },
        4: { name: 'Mist' },
        5: { name: 'Helder' },
        6: { name: 'Sneeuw' }
    }
}

Object.freeze(Weather);


