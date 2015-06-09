var express = require("express"),
  app = express(),
  http = require("http").createServer(app),
  request = require('request'),
  moment = require('moment'),
  nano = require('nano')('http://localhost:5984');

app.set("ipaddr", "127.0.0.1");
app.set("port", 8110);

http.listen(app.get("port"), app.get("ipaddr"), function () {
  console.log("Car Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

app.get("/weather/", function (data, res) {
  var City = data.param('City'),
    indate = data.param('Date'),
    daysadded = data.param('Days'),
    weather_database_draft_1 = nano.use('weather_database_draft_1');

  if (City == null && indate == null) {
    weather_database_draft_1.view('practice1', 'Temp', function (err, body) {
      if (!err) {
        res.send(body);
      }
    });
  } else if (indate == null && City != null) {
    weather_database_draft_1.view('practice1', 'Name_of_city', { startkey: City, endkey : City }, function (err, body) {
      if (!err) {
        weather_database_draft_1.view('practice1', 'Temp', { startkey: parseInt(body.rows[0].value), endkey : parseInt(body.rows[0].value)}, function (err, body) {
          if (!err) {
            res.send(body);
          }
        });
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
      weather_database_draft_1.view('practice1', 'datefirst', { startkey: indate, endkey : someFormattedDate}, function (err, body) {
        if (!err) {
          res.send(body);
        }
      });
    } else {
      weather_database_draft_1.view('practice1', 'datefirst', { startkey: indate, endkey : indate}, function (err, body) {
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
      weather_database_draft_1.view('practice1', 'Name_of_city', { startkey: City, endkey : City }, function (err, body) {
        if (!err) {
          weather_database_draft_1.view('practice1', 'citywithdate', { startkey: [parseInt(body.rows[0].value), indate], endkey : [parseInt(body.rows[0].value), someFormattedDate]}, function (err, body) {
            if (!err) {
              res.send(body);
            }
          });
        }
      });
    } else {
       weather_database_draft_1.view('practice1', 'Name_of_city', { startkey: City, endkey : City }, function (err, body) {
        if (!err) {
          weather_database_draft_1.view('practice1', 'citywithdate', { startkey: [parseInt(body.rows[0].value), indate], endkey : [parseInt(body.rows[0].value), indate]}, function (err, body) {
            if (!err) {
              res.send(body);
            }
          });
        }
      });

    }
  }


});

