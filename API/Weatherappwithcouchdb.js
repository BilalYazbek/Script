var express = require("express"),
  app = express(),
  http = require("http").createServer(app),
  request = require('request'),
  moment = require('moment'),
  nano = require('nano')('http://localhost:5984');

app.set("ipaddr", "127.0.0.1");
app.set("port", 8000);

http.listen(app.get("port"), app.get("ipaddr"), function () {
  console.log("Car Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

app.get("/weather/", function (data, res) {
  var City = data.param('City'),
    indate = data.param('Date'),
    daysadded = data.param('Days'),
    weather_database = nano.use('weather_database');

  if (City == null && indate == null) {
    weather_database.view('view', 'List_Only_numbers', function (err, body) {
      if (!err) {
        res.send(body);
      }
    });
  } else if (indate == null && City != null) {
    weather_database.view('view', 'List_Only_numbers', { startkey: [City], endkey : [City, {}] }, function (err, body) {
      if (!err) {
        res.send(body);
      }
    });
  } else if (City == null && indate != null) {
    if (daysadded != null) {
      var enddate = moment(indate, "DD/MM/YYYY");
      enddate.add('days', daysadded);
      var d = new Date(enddate);
      var day = d.getDate();
      var month = d.getMonth() + 1;
      var year = d.getFullYear();
      var someFormattedDate = day + '-' + month + '-' + year;
      weather_database.view('view', 'datefirst', { startkey: [indate], endkey : [someFormattedDate, {}]}, function (err, body) {
        if (!err) {
          res.send(body);
        }
      });
    } else {
      weather_database.view('view', 'datefirst', { startkey: [indate], endkey : [indate, {}]}, function (err, body) {
        if (!err) {
          res.send(body);
        }
      });
    }
  } else {
    if (daysadded != null) {
      var enddate = moment(indate, "DD/MM/YYYY");
      enddate.add('days', daysadded);
      var d = new Date(enddate);
      var day = d.getDate();
      var month = d.getMonth() + 1;
      var year = d.getFullYear();
      var someFormattedDate = day + '-' + month + '-' + year;
      weather_database.view('view', 'List_Only_numbers', { startkey: [City, indate], endkey : [City, someFormattedDate]}, function (err, body) {
        if (!err) {
          res.send(body);
        }
      });
    } else {
      weather_database.view('view', 'List_Only_numbers', { startkey: [City, indate], endkey : [City, indate]}, function (err, body) {
        if (!err) {
          res.send(body);
        }
      });
    }
  }
});



