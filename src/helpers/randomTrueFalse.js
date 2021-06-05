import randomInt from "./randomInt";

export default function randomTrueFalse() {
    let random = randomInt(0, 1);
    if (random === 0) {
        return true;
    } else {
        return false;
    }
}