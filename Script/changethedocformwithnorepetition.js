var request = require('request'),
  moment = require('moment'),
  nano = require('nano')('http://localhost:5984'),
  weather_database = nano.use('weather_database'),
  weather_database_draft_2 = nano.use('weather_database_draft_2'),
  async = require("async"),
  fs = require('fs');

function weather() {
  weather_database.view('view', 'cityinfo', function (err, body) {
    if (!err) {
      async.each(body.rows, function (file, callback) {
        weather_database_draft_2.insert({ Name : file.value.name, Country : file.value.country, Population : file.value.population, Coord : file.value.coord, Type : "City" }, file.key.toString(), function (err, body) {
          callback();
        });
      }, function (err) {
        if (err) {
          console.log("Error");
        } else {
          weather_database.view('view', 'daysinfo1', function (err, body) {
            if (!err) {
              async.each(body.rows, function (file, callback) {
                weather_database_draft_2.insert({key : {City_id : file.key, date : file.value.dt}, Temprature : file.value.temp, Pressure : file.value.pressure, humidity : file.value.humidity, weather : file.value.weather, speed : file.value.speed, clouds : file.value.clouds, deg : file.value.deg, rain : file.value.rain, Type : "Weather" }, (parseInt(file.key)+parseInt(file.value.dt)).toString(), function (err, body1) {
                  if(!err){
                  console.log(body1);
                  request.head('http://openweathermap.org/img/w/' + file.value.weather[0].icon + '.png', function (err, res, body2) {
                    request('http://openweathermap.org/img/w/' + file.value.weather[0].icon + '.png').pipe(weather_database_draft_2.attachment.insert(body1.id, 'image', null, 'image/png', {rev : body1.rev})
 
                      );

                  });
                }
                  callback();
                });
              }, function (err) {
                if (err) {
                  console.log("Error");
                } else {
                  console.log("inserted");
                }
              });
            }

          });
        }
      });
    }

  });
}

weather();