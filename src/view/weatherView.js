export default class weatherView {

    controller;

    text;
    button;
    lat;
    lon;

    constructor(controller) {
        this.controller = controller;
        this.text = document.getElementById('weatherText');
        this.button = document.getElementById('weatherButton');
        this.lat = document.querySelector('#latWeather');
        this.lon = document.querySelector('#lonWeather');

        this.button.addEventListener("click", () => {
            // console.log('Values: lat: ' + this.lat.value + ', lon: ' + this.lon.value);
            controller.update(this.lat.value, this.lon.value);
        });
    }

    update(string){
        this.text.innerText = 'Weer: ' + string;
    }
}