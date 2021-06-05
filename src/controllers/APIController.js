import WeatherView from "../view/WeatherView";
import Weather from "../enums/weather";

export default class APIController {
    
    mainController;
    apiKey = '260eda12b10a3e46cdd73d7d31bae78f';
    openweatherURI = 'https://api.openweathermap.org/data/2.5/onecall?';
    currentWeatherOnly = true;

    weatherView;

    constructor(mainController){
        this.mainController = mainController;
        this.weatherView = new WeatherView(this);
    }

    update(lat, lon){
        this.getWeatherByLatLon(lat, lon)
            .then((response) => {
                switch (response){
                    case 'Fail':
                        console.log('update switch fail!');
                        break;
                    default:
                        console.log('Set weather to: ' + Weather.properties[response].name);
                        this.updateView(Weather.properties[response].name);
                }
            });
    }

    getWeatherByLatLon(lat, lon){
        var urlString = this.buildUri(lat, lon);
        return fetch(urlString)
            .then(res =>  res.json())
            .then((res) => {
                if (res.current.weather[0].main){
                    // console.log(res.current.weather[0]);
                    var value = this.getWeatherType(res.current.weather[0].main)
                    return value;
                }
                else {
                    console.log('Could not get weather!');
                    return 'Fail';
                }
            })
            .catch(error => {
                console.log('getWeatherByLatLon(): ' + error);
                return 'Fail';
            })
            
    }

    getWeatherType(string){
        var returnValue = Weather.NONE;
        switch (string) {
            case 'Clouds':
                returnValue = Weather.BEWOLKT;
                break;
            case 'Rain':
                returnValue = Weather.REGEN;
                break;
            case 'Clear':
                returnValue = Weather.HELDER;
                break;
            case 'Snow':
                returnValue = Weather.SNEEUW;
                break;
            case 'Fog':
                returnValue = Weather.MIST;
                break;
            default:
                returnValue = Weather.NONE;
        }
        return returnValue;
    }

    updateView(string){
        this.weatherView.update(string);
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