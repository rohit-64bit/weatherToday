// ALL THE IMPORTS REQUIRED ARE HERE
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// SECRETS ARE IMPORTED
require('dotenv').config();
const apiKey = `${process.env.API_KEY}`;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));
app.set('view engine', 'ejs');



// app.get('/localWeather', (req, res) => {
//     res.render('index', { weatherLocal: null, error: null });
// });

// app.post('/localWeather', (req, res) => {

//     let localLocation = `http://api.openweathermap.org/data/2.5/weather?lat=${req.body.localLat}&lon=${req.body.localLong}&units=metric&appid=${apiKey}`


//     console.log(req.body);


//     request(localLocation, function (err, response, body) {

//         // On return, check the json data fetched
//         if (err) {
//             res.render('index', { weatherLocal: null, error: 'Error, please try again' });
//         } else {
//             let weatherLocal = JSON.parse(body);

//             // We shall output it in the console just to make sure that the data being displayed is what we want
//             console.log("___________________ LOCAL WEATHER ___________________")
//             console.log(weatherLocal);
//             console.log("_____________________________________________________")


//             if (weatherLocal.main == undefined) {
//                 res.render('index', { weatherLocal: null, error: 'Error, please try again' });
//             } else {
//                 // we shall use the data got to set up our output
//                 let place = `${weatherLocal.name}, ${weatherLocal.sys.country}`,

//                     // We shall calculate the current timezone using the data fetched
//                     weatherTimezone = `${new Date(weatherLocal.dt * 1000 - (weatherLocal.timezone * 1000))}`;
//                 let longitude = `${req.body.localLong}`;
//                 let latitude = `${req.body.localLat}`;

//                 let weatherTemp = `${weatherLocal.main.temp}`,
//                     weatherPressure = `${weatherLocal.main.pressure}`,

//                     /* We shall fetch the weather icon and its size using the icon data*/
//                     weatherIcon = `http://openweathermap.org/img/wn/${weatherLocal.weather[0].icon}@2x.png`,
//                     weatherDescription = `${weatherLocal.weather[0].description}`,
//                     humidity = `${weatherLocal.main.humidity}`,
//                     clouds = `${weatherLocal.clouds.all}`,
//                     visibility = `${weatherLocal.visibility}`,
//                     main = `${weatherLocal.weather[0].main}`,
//                     weatherFahrenheit;
//                 weatherFahrenheit = ((weatherTemp * 9 / 5) + 32);

//                 // We shall also round off the value of the degrees fahrenheit calculated into two decimal places
//                 function roundToTwo(num) {
//                     return +(Math.round(num + "e+2") + "e-2");
//                 }
//                 weatherFahrenheit = roundToTwo(weatherFahrenheit);

//                 // We shall now render the data to our page (index.ejs) before displaying it out
//                 res.render('index', { weatherLocal: weatherLocal, placeLocal: place, tempLocal: weatherTemp, pressureLocal: weatherPressure, iconLocal: weatherIcon, descriptionLocal: weatherDescription, timezoneLocal: weatherTimezone, humidityLocal: humidity, fahrenheitLocal: weatherFahrenheit, cloudsLocal: clouds, visibilityLocal: visibility, mainLocal: main, lonLocal: longitude, latLocal: latitude, error: null });


//             }
//         }
//     });
// });


app.get('/', function (req, res) {
    res.render('index', { weather: null, error: null });
});

app.post('/', function (req, res) {

    // getting city name through input
    let city = req.body.city;

    // getting weather according to city name

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    let forecast = {};
    let weather = {};
    // getting weather forecast using the city name
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=7&appid=${apiKey}`;


    // Request for data using the URL
    request(url, function (err, response, body) {

        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            weather = JSON.parse(body);
            // We shall output it in the console just to make sure that the data being displayed is what we want
            console.log("___________________ REQUESTED WEATHER ___________________")
            console.log(weather);
            console.log("_________________________________________________________")

            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                // we shall use the data got to set up our output
                let place = `${weather.name}, ${weather.sys.country}`,
                    /* We shall calculate the current timezone using the data fetched*/
                    weatherTimezone = `${new Date(weather.dt * 1000 - (weather.timezone * 1000))}`;
                let longitude = `${weather.coord.lon}`;
                let latitude = `${weather.coord.lat}`;

                let weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,

                    /* We shall fetch the weather icon and its size using the icon data*/
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    weatherFahrenheit;
                weatherFahrenheit = ((weatherTemp * 9 / 5) + 32);

                // We shall also round off the value of the degrees fahrenheit calculated into two decimal places
                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);

                // We shall now render the data to our page (index.ejs) before displaying it out
                res.render('index', { weather: weather, place: `${weather.name}, ${weather.sys.country}`, temp: `${weather.main.temp}`,pressure: `${weather.main.pressure}`, icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`, description: `${weather.weather[0].description}`, timezone: weatherTimezone, humidity: `${weather.main.humidity}`, fahrenheit: `((${weather.main.temp} * 9 / 5) + 32)`, clouds: `${weather.clouds.all}`, visibility: `${weather.visibility}`, main: `${weather.weather[0].main}`, lon: `${weather.coord.lon}`, lat: `${weather.coord.lat}`, error: null });
            }
        }
    });

    request(forecastUrl, function (err, response, body) {

        // On return, check the json data fetched
        if (err) {
            res.render('index', { forecast: null, error: 'Error, please try again' });
        } else {
            forecast = JSON.parse(body);

            // We shall output it in the console just to make sure that the data being displayed is what we want
            console.log("___________________FORECASTED WEATHER____________________")
            console.log(forecast);
            console.log("_________________________________________________________")

            if (forecast.cod == undefined) {
                res.render('index', { forecast: null, error: 'Error, please try again' });
            } else {
                // we shall use the data got to set up our output
                
                
                // We shall now render the data to our page (index.ejs) before displaying it out
                // res.render('index', { forecast:forecast,error: null });
            }
        }
    });

    
});




// We shall set up our port configurations
app.listen(5000, function () {
    console.log('Weather app listening on port 5000!');
});