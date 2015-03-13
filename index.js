var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var app = express();

var oneDay = 86400000;

app.use(compression);

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.use(bodyParser);

app.listen(process.env.PORT);

app.post('/', function(req, res){
  var result = req.rawBody;
  res.send("hello there world data is " + result);
});
