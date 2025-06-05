const express = require('express');
const path = require('path');
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const apiKey = process.env.API_KEY;

// Middleware pour parser les formulaires
app.use(express.urlencoded({ extended: true }));

// Configuration du moteur de templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Exemple de route d'accueil
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  request(url, function (err, response, body) {
      if(err){
        res.render('index', {weather: null, error: 'Error, please try again'});
        console.log(err);
      } else {
        let weather = JSON.parse(body);
        console.log(weather);
        if(weather.main == undefined){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    });
  })

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
