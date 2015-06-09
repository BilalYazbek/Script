var nano = require('nano')('http://localhost:5984'),
  request = require('request'),
  moment = require('moment'),
  accessUrl;

function weather() {

  function accessUrl(address, callback) {
    var options = {
        headers: {'user-agent': 'Mozilla/5.0',  'x-api-key': 'c064dbe7d8b85d5073a73ca6a9b549c3'},
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&cnt=5&q=' + address,
        json: true
      };

    request.get(options, function (err, response, body_json) {
      if (!err && response.statusCode === 200) {
        callback(null, body_json);
      } else {
        callback(err);
      }
    });
  }
  var city = "London";
  accessUrl(city, function (err, result) {
    if (err) {
      console.log("error");
    } else {
      var weather_database = nano.use('weather_database');
      weather_database.insert({Data : result, CurrentDate : moment().format('D'), Date: moment().format('MMMM Do YYYY, h:mm:ss a')}, function (err, body, header) {
        if (err) {
          console.log('[weather_database.insert] ', err.message);
        } else {
          console.log('ok');
        }
      });
    }
  });


}
setInterval(weather, 3600000);






