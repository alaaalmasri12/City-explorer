'use strict';

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
   
    const geoorphicalData =require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city,geoorphicalData);
    res.send(locationData);

})

function Location (city,geoorphicalData) {
    this.search_query = city;
    this.formatted_query =geoorphicalData[0].display_name;
    this.latitude = geoorphicalData[0].lat;
    this.longitude = geoorphicalData[0].lon;

}


server.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
    res.status(500).send(error);
})