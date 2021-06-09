const displayLevel = 3;

export default function log(message) {
    if (displayLevel === 1 )
        console.log(message);
}

export function verbose(message) {
    if (displayLevel === 2 )
        console.log(message);
}

export function superVerbose(message){
    if (displayLevel === 3)
        console.log(message);
}