var request = require('request'),
  moment = require('moment'),
  nano = require('nano')('http://localhost:5984'),
  weather_database_draft_3 = nano.use('weather_database_draft_3'),
  weather_database_draft_4 = nano.use('weather_database_draft_4'),
  async = require("async"),
  fs = require('fs');

function buildDoc(city, year, month, day, body) {
  return {key: {City_id : city, date : new Date(year, month, day).getTime() / 1000},
          Temprature : {day : parseInt(Math.random() * (body.rows[5].value.max - body.rows[5].value.min) + body.rows[5].value.min),
            min: parseInt(Math.random() * (body.rows[8].value.max - body.rows[8].value.min) + body.rows[8].value.min),
            max: parseInt(Math.random() * (body.rows[7].value.max - body.rows[7].value.min) + body.rows[7].value.min),
            eve : parseInt(Math.random() * (body.rows[6].value.max - body.rows[6].value.min) + body.rows[6].value.min),
            morn: parseInt(Math.random() * (body.rows[9].value.max - body.rows[9].value.min) + body.rows[9].value.min),
            night : parseInt(Math.random() * (body.rows[10].value.max - body.rows[10].value.min) + body.rows[10].value.min)},
          Pressure : parseInt(Math.random() * (body.rows[3].value.max - body.rows[3].value.min) + body.rows[3].value.min),
          humidity : parseInt(Math.random() * (body.rows[2].value.max - body.rows[2].value.min) + body.rows[2].value.min),
          speed : parseInt(Math.random() * (body.rows[4].value.max - body.rows[4].value.min) + body.rows[4].value.min),
          clouds : parseInt(Math.random() * (body.rows[0].value.max - body.rows[0].value.min) + body.rows[0].value.min),
          deg : parseInt(Math.random() * (body.rows[1].value.max - body.rows[1].value.min) + body.rows[1].value.min), Type : "Weather" };
}

function weather() {
  var London = 6058560,
    Canada = 7626289,
    NewYork = 5128638,
    datestring = ["1/1/2014", "2/1/2014", "3/1/2014", "4/1/2014", "5/1/2014", "1/2/2014", "2/2/2014", "3/2/2014", "4/2/2014", "5/2/2014", "1/3/2014", "2/3/2014", "3/3/2014", "4/3/2014", "5/3/2014", "1/4/2014", "2/4/2014", "3/4/2014", "4/4/2014", "5/4/2014", "1/5/2014", "2/5/2014", "3/5/2014", "4/5/2014", "5/5/2014",
      "1/1/2015", "2/1/2015", "3/1/2015", "4/1/2015", "5/1/2015", "1/2/2015", "2/2/2015", "3/2/2015", "4/2/2015", "5/2/2015", "1/3/2015", "2/3/2015", "3/3/2015", "4/3/2015", "5/3/2015", "1/4/2015", "2/4/2015", "3/4/2015", "4/4/2015", "5/4/2015", "1/5/2015", "2/5/2015", "3/5/2015", "4/5/2018", "5/5/2015",
        "1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016", "5/1/2016", "1/2/2016", "2/2/2016", "3/2/2016", "4/2/2016", "5/2/2016", "1/3/2016", "2/3/2016", "3/3/2016", "4/3/2016", "5/3/2016", "1/4/2016", "2/4/2016", "3/4/2016", "4/4/2016", "5/4/2016", "1/5/2016", "2/5/2016", "3/5/2016", "4/5/2016", "5/5/2016",
            "1/1/2017", "2/1/2017", "3/1/2017", "4/1/2017", "5/1/2017", "1/2/2017", "2/2/2017", "3/2/2017", "4/2/2017", "5/2/2017", "1/3/2017", "2/3/2017", "3/3/2017", "4/3/2017", "5/3/2017", "1/4/2017", "2/4/2017", "3/4/2017", "4/4/2017", "5/4/2017", "1/5/2017", "2/5/2017", "3/5/2017", "4/5/2017", "5/5/2017",
                            "1/1/2018", "2/1/2018", "3/1/2018", "4/1/2018", "5/1/2018", "1/2/2018", "2/2/2018", "3/2/2018", "4/2/2018", "5/2/2018", "1/3/2018", "2/3/2018", "3/3/2018", "4/3/2018", "5/3/2018", "1/4/2018", "2/4/2018", "3/4/2018", "4/4/2018", "5/4/2018", "1/5/2018", "2/5/2018", "3/5/2018", "4/5/2018", "5/5/2018"];
  weather_database_draft_3.view('view', 'pressure', { group_level : 1}, function (err, body) {
    async.each(datestring, function (file, callback) {
      var dt = moment(file, "DD/MM/YYYY");
      var d = new Date(dt);
      var day = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();
      var doc = buildDoc(London, year, month, day, body);
      var doc1 = buildDoc(Canada, year, month, day, body);
      var doc2 = buildDoc(NewYork, year, month, day, body);
      weather_database_draft_4.insert(doc, function (err, body) {
        if (!err) {
          console.log(body, "inserted");
        }
        if (err) {
          console.log(err);
        }
      });
      weather_database_draft_4.insert(doc1, function (err, body) {
        if (!err) {
          console.log(body, "inserted");
        }
        if (err) {
          console.log(err);
        }
      });
      weather_database_draft_4.insert(doc2, function (err, body) {
        if (!err) {
          console.log(body, "inserted");
        }
        if (err) {
          console.log(err);
        }
      });
      callback();
    });
  });



}
weather();