export default class Group {

    #id;
    #size;
    #x;
    #y;

    constructor(size, x, y, id) {
        this.#size = size;
        this.#x = x;
        this.#y = y;
        this.#id = id;
    }

    get id(){
        return this.#id;
    }

    get size() {
        return this.#size;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}