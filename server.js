'use strict';
const superagent = require('superagent');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL2);
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.get('/location', locationhandler)
function locationhandler(req, res) {
    // const geoorphicalData = require('./data/geo.json');
    // const city = req.query.city;
    // const locationData = new Location(city, geoorphicalData);
    // res.send(locationData);
    const city = req.query.city;
    getlocation(city)
        .then(locationData => res.status(200).json(locationData));
}



app.get('/yelp',yelphandler);

function yelphandler()
{
    const city = req.query.search_query;
    getyelp(city)
        .then(hikesData => res.status(200).send(hikesData)); 
}


function getyelp(city)
{
    
}
var lat;
var lon;
function getlocation(city) {
    let SQL = 'SELECT * FROM locations WHERE  search_query=$1;';
    let safevalues = [city];
    return client.query(SQL, safevalues)
        .then(results => {
            console.log('asdkaslkdla');
            if (results.count) {
                 results.row[0];
            }
            else {
                console.log(city);
                let key = process.env.GEOCODE_API_KEY;
                const Url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
                return superagent.get(Url)
                    .then(geodata => {
                        let SQL = 'INSERT INTO locations(search_query,formatted_query,latitude,longitude)VALUES($1,$2,$3,$4);';
                        var locationData = new Location(city, geodata.body);
                        lat = locationData.latitude;
                        lon = locationData.longitude;
                        console.log(locationData);
                        let safevalues = [city, locationData.formatted_query, lat, lon];
                        return client.query(SQL, safevalues)
                            .then(results => {
                                 results.rows[0];
                                console.log('sdfdsfds',results);
                            })
                        //   return locationData;
                    })
                    .catch(error => errorHandler(error));
            }
            // res.status(200).json(result.rows);
        })


    }


  
app.get('/weather', weatherhandler)
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
function getwather(city) {
    let key = process.env.weatherAPI;
    const watherinfo = [];
    const Url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
    console.log('asdasdasdsa', Url);
    return superagent.get(Url)
        .then(weatherData => {
            return weatherData.body.data.map(val => {
                var weatherData = new Weather(val);
                return weatherData;
                console.log(weatherData, city);
            });
        });
}
app.get('/trails', hikeshandler)
app.get('/movies',moviehandler);
function hikeshandler(req, res) {
    const longitude = req.query.lon;
    const Latitude = req.query.lat;
    gethikes(Latitude, longitude)
        .then(hikesData => res.status(200).send(hikesData));
}
function gethikes(latitude, longitude) {
    let key = process.env.TRAIL_API_KEY;
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
function moviehandler(req,res)
{
var location=req.query.search_query;
console.log(location);
getmovie(location)
.then(movieData => res.status(200).json(movieData));
}
function Location(city, LocData) {
    this.search_query = city;
    this.formatted_query = LocData[0].display_name;
    this.latitude = LocData[0].lat;
    this.longitude = LocData[0].lon;
}
function getmovie(location) {
console.log("alaa");
    let key = process.env.MOVIE_API_KEY;
    const Url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${location}`;
    return superagent.get(Url)
        .then(movieData => {
            console.log(movieData.body);
            return movieData.body.results.map(val => {
                var movieData = new Movies(val);
                return movieData;
            });
        })
        .catch(errorHandler)
}
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
}
function Hikes(hike) {
    // console.log(hike);
    this.name = hike.name;
    this.location = hike.location;
    this.length = hike.length;
    this.stars = hike.stars;
    this.star_votes = hike.starVotes;
    this.summery = hike.summary;
    this.trail_url = hike.url;
    this.conditions = hike.conidation;
    this.condition_date = hike.condition_date;
    this.condition_time = hike.condition_time;
}
function Movies(movie)
{
    this.title=movie.title;
    this.overview=movie.overview;
    this.average_votes=movie.vote_average;
    this.total_votes=movie.vote_count;
    this.image_ur=`https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.popularity=movie.popularity;
    this.released_on=movie.release_date;
}




    app.use('*', (req, res) => {
        res.status(404).send('NOT FOUND');
    });
    // app.get('*', notFoundHandler);
    app.use(errorHandler);
    function notFoundHandler(request, response) {
        response.status(404).send('huh????');
    }
    function errorHandler(error, request, response) {
        response.status(500).send(error);
    }


    client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on PORT${PORT}`)
        })
    });
/
