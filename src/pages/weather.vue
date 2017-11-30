<template>
    <f7-page>
        <div id="weather-page" :style="{ 'background-image': 'url(' + dayOrNight + ')' }">
            <div id="effect"></div>
            <h2>{{ city }}</h2>
            <div>{{ weatherDesc }}</div>
            <img class="weather-icon" :src="weatherImage"/>
            <h1> {{curTempDisplay}} ℃</h1>
        </div>
    </f7-page>
</template>
<style>
.weather-icon{
    width: 150px;
    height: 150px;
}
#effect{
    position: fixed;
    top: -100px;
}
#weather-page{
    background: #000;
    color: #fff;
    font-size: 3em;
    height:100%;
    text-align: center;
}
</style>
<script>
import thunder from '../assets/weather/thunder.png';
import rain from '../assets/weather/rain.png';
import snow from '../assets/weather/snow.png';
import mist from '../assets/weather/mist2.png';
import sun from '../assets/weather/sun.png';
import clouds from '../assets/weather/clouds.png';
import cloudy from '../assets/weather/cloudy.png';
import day from '../assets/weather/ios_day.jpg';
import night from '../assets/weather/ios_night.jpg';

import Matter from 'matter-js';
import cloth from './cloth';
var CELSIUS = 0, FAHRENHEIT = 1;

export default{
    mounted: function(){
        var Engine = Matter.Engine;
        var Render = Matter.Render;
        this.clothes = cloth();
        Engine.run(this.clothes.engine);
        Render.run(this.clothes.render);
    },
    created: function(){
        this.getLocation();
    },
    data: function(){
        return {
            latitude: 0.0,
            longitude: 0.0,
            city: 'Hello from MELBOURNE',
            curTemp: null,
            displayMode: CELSIUS,
            dataObj: null,
            weatherMain: 'Fine',
            weatherDesc: 'Clear day',
            errorMsg: '',
        }
    },
    computed: {
        dayOrNight: function(){
            var currentTime = new Date().getHours();
            if (6 <= currentTime && currentTime < 18){
                return day;
            }else{
                return night;
            }
        },
        weatherImage: function() {
            if (this.dataObj != null){
                var weatherID = this.dataObj.weather[0].id;
                if (weatherID >= 200 && weatherID <= 232) {
                    return thunder;
                } else if (weatherID >= 300 && weatherID <= 321) {
                    return rain;
                } else if (weatherID >= 500 && weatherID <= 531) {
                    return rain;
                } else if (weatherID >= 600 && weatherID <= 622) {
                    return snow;
                } else if (weatherID >= 701 && weatherID <= 781) {
                    return mist;
                } else if(weatherID == 800) {
                    return sun;
                } else if (weatherID >= 801 && weatherID <= 804) {
                    return clouds;
                } else if (weatherID >= 900 && weatherID <= 962) {
                    return cloudy;
                }
            }
            return '';
        },
        curTempDisplay: function() {
            if (this.curTemp != null) {
                if (this.displayMode == CELSIUS) {
                    return (this.curTemp - 273.15).toFixed(1);
                } else {
                    return (this.curTemp * 9/5 - 459.67).toFixed(1);
                }
            } else {
                return null;
            }      
        },
    },
    methods: {
        getTemp: function(option) {
            this.displayMode = option;
        },
        getLocation: function() {
            if (!navigator.geolocation) {
                this.errorMsg = "Geolocation is not supported by your browser";
                this.city = this.errorMsg;
                console.warn(this.errorMsg);
                return;
            }
            console.log('Getting current position..');
            var options = {timeout:60000};
            navigator.geolocation.getCurrentPosition(this.success, this.error, options);
        },
        success: function(position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.latitude = parseFloat(this.latitude).toFixed(2);
            this.longitude = parseFloat(this.longitude).toFixed(2);

            this.getWeather();
        },
        error: function(err) {
            this.errorMsg = "Unable to retrieve your location";
            this.city = this.errorMsg;
            
            console.warn(`ERROR(${err.code}): ${err.message}`);
            console.warn(this.errorMsg);
        },
        getWeather: function() {
            var reqURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + this.latitude + '&lon=' + this.longitude + '&APPID=dad7bea62afe665e207a6c5dd63a6c65';
            
            this.$http.get(reqURL).then(function(response) {
                this.dataObj = response.data;
                this.curTemp = this.dataObj.main.temp;
                this.city = this.dataObj.name;
                this.weatherMain = this.dataObj.weather[0].main;
                this.weatherDesc = this.dataObj.weather[0].description;
            }, function(response) {
                console.log(response);
            });
        }
    }
}

</script>
