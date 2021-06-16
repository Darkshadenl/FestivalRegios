export default class WeatherView {

    controller;
    lat;
    long;

    constructor(controller) {
        this.controller = controller;

        const info = document.getElementById("weatherInfo");
        const api = document.getElementById("api");

        const btn = document.createElement('btn');
        btn.id = "weatherBtn";
        const text = document.createElement('h2');
        const lat = document.createElement("input");
        const long = document.createElement("input");

        lat.id = "latWeather";
        long.id = "longWeather";
        lat.setAttribute('placeholder', 'Latitude');
        lat.type = "text";
        long.type = "text";
        long.setAttribute('placeholder', 'Longtitude');
        text.innerText = "No info yet";
        text.id = "infoText";
        text.className = "ml-4";
        btn.innerText = "Wijzig locatie";
        btn.className = "ml-4 btn btn-success";

        this.lat = lat;
        this.long = long;

        api.appendChild(lat);
        api.appendChild(long);
        api.appendChild(btn);

        info.appendChild(text);

        btn.addEventListener("click", () => {
            controller.update(this.lat.value, this.long.value);
            // TODO replace defaults
            // const long = 5.85462200;
            // const lat = 51.84286700;
            // controller.update(lat, long);
        });
    }

    update(string){
        const text = document.getElementById("infoText");
        text.innerText = 'Weer: ' + string;
    }
}