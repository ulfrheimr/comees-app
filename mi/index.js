var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/mi');

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', require('./routes'));

app.use(function(req, res, next) {
  var error = new Error("Not found");
  error.status = 404;
  error.message = "Not found resource";

  res.send(error);
  next();
});

app.set('port', port);

var server = app.listen(app.get('port'), function() {
  console.log("Running CC @" + server.address().port)
});
