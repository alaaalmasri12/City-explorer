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


server.get('/location',locationhandler) 

function locationhandler(req, res) {
       // const geoorphicalData = require('./data/geo.json');
    // const city = req.query.city;
    // const locationData = new Location(city, geoorphicalData);
    // res.send(locationData);
    const city = req.query.city;
    console.log(city);
     getlocation(city)
        .then(locationData => res.status(200).json(locationData));
}
 
server.get('/weather', weatherhandler)
function weatherhandler(req, res) {
    const city = req.query.search_query;
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


server.get('/trails',hikeshandler) 
function hikeshandler(req,res)
{
    
    const longitude = req.query.lon;
    const Latitude  = req.query.lat;
    gethikes(Latitude,longitude)
       .then(hikesData => res.status(200).send(hikesData));

}

function gethikes(latitude,longitude)
{
    let key=process.env.TRAIL_API_KEY;
    const Url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${key}`;
    // console.log(Url);
    return superagent.get(Url)
    .then(hikeData => {
       return hikeData.body.trails.map(val => {
          var hikeData = new Hikes(val);
          return hikeData;
        });
        
        });
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
function getlocation(city) {
    let key = process.env.GEOCODE_API_KEY;
    const Url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    return superagent.get(Url)
    .then(geodata => {
          var locationData = new Location(city,geodata.body);
        return locationData;
        });
}
function Location(city,LocData) {
    this.search_query = city;
    this.formatted_query = LocData[0].display_name;
    this.latitude = LocData[0].lat;
    this.longitude = LocData[0].lon;
}
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
}

function Hikes(hike) {
    // console.log(hike);
    this.name = hike.name;
    this.location= hike.location;
    this.length=hike.length;
    this.stars=hike.stars;
    this.star_votes=hike.starVotes;
    this.summery=hike.summary;
    this.trail_url=hike.url;
    this.conditions=hike.conidation;
    this.condition_date=hike.condition_date;
    this.condition_time=hike.condition_time;

}
server.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
    res.status(500).send(error);
})