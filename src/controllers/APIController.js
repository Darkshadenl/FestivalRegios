// const got = require('got')

export default class APIController {
    
    #mainController;
    apiKey = '260eda12b10a3e46cdd73d7d31bae78f';
    openweatherURI = 'https://api.openweathermap.org/data/2.5/onecall?';
    currentWeatherOnly = true;

    constructor(mainController){
        this.#mainController = mainController;
    }

    

    getWeatherByLatLon(lat, lon){
        var urlString = this.buildUri(lat, lon);
        return fetch(urlString)
            .then(res =>  res.json())
            .then((res) => {
                if (res.current.weather[0].main){
                    return res.current.weather[0].main;
                }
                else {
                    console.log('Could not get weather!');
                    return 'No weather';
                }
            })
            .catch(error => {
                console.log('getWeatherByLatLon(): ' + error);
                
            })
            
    }

    buildUri(lat, lon){
        var coordinates = 'lat=' + lat + '&lon=' + lon;
        var exclusions = '';
        if (this.currentWeatherOnly){
            exclusions = '&exclude=minutely,hourly,daily,alerts';
        }
        var appid = '&appid=' + this.apiKey;
        var returnString = this.openweatherURI + coordinates + exclusions + appid;
        console.log('APIController: Call with string: ' + returnString);
        return returnString;
    }
}