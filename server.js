'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
var ammanweatherdata=[];
const server = express();

server.use(cors());

server.listen(PORT, () => {
    console.log(`Listening on PORT${PORT}`);
})


server.get('/location', (req, res) => {
   
    const geoorphicalData =require('./data/geo.json');
    const city = req.query.city_name;
    const locationData = new Location(city,geoorphicalData);
    res.send(locationData);

})

server.get('/weather', (req, res) => {
   
    const WeatherData =require('./data/weather.json');
    const city = req.query.city;
    let weatherarr=[];
        for(let i=0;i<WeatherData.data.length;i++)
    {
        const weather = new Weather(city,WeatherData,i);
weatherarr.push(weather);
    }
    res.send(weatherarr);

})



function Location (city,geoorphicalData) {
    this.search_query = city;
    this.formatted_query =geoorphicalData[0].display_name;
    this.latitude = geoorphicalData[0].lat;
    this.longitude = geoorphicalData[0].lon;

}
function Weather(city,WeatherData,i)
{
    
        this.forcast = WeatherData.data[i].weather.description;
        this.time = WeatherData.data[i].datetime; 
    
        
      
    
}



server.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
    res.status(500).send(error);
})