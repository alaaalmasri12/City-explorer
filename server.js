'use strict';
const superagent = require('superagent');

const express = require('express');

const cors = require('cors');


require('dotenv').config();

const PORT = process.env.PORT || 3000;
const server = express();

server.use(cors());

server.listen(PORT, () => {
    console.log(`Listening on PORT${PORT}`);
})


server.get('/location', (req, res) => {

    const geoorphicalData = require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city, geoorphicalData);
    res.send(locationData);

})

server.get('/weather', weatherhandler)
function weatherhandler(req, res) {
    const city = req.query.city;
    //     var weatherarr=[];
    //    const WeatherData=require('./data/weather.json');
    //         WeatherData.data.map((val)=>{
    //             let weather = new Weather(city,val);
    //              weatherarr.push(weather);
    //     })
    // res.send(weatherarr);
    console.log(city);
     getwather(city)
        .then(weatherData => res.status(200).json(weatherData));
}
function Location(city, geoorphicalData) {
    this.search_query = city;
    this.formatted_query = geoorphicalData[0].display_name;
    this.latitude = geoorphicalData[0].lat;
    this.longitude = geoorphicalData[0].lon;
}


function getwather(city) {

    let key = process.env.weatherAPI;
    const watherinfo=[];    
    const Url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
    console.log('asdasdasdsa',Url);
    return superagent.get(Url)
    .then(weatherData => {
        weatherData.body.data.map(val => {
          var weatherData = new Weather(val);
          watherinfo.push(weatherData);
          console.log(weatherData,city);
        });
        return watherinfo;

        });

}
function Weather(day) {

    this.forcast = day.weather.description;
    this.time = day.datetime;
}
server.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
    res.status(500).send(error);
})