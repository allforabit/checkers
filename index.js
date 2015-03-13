var express = require('express');
var app = express();

var oneDay = 86400000;

app.use(express.compress());

app.use(express.static(__dirname + '/', { maxAge: oneDay }));

app.use(express.bodyParser());

app.listen(process.env.PORT);

app.post('/', function(req, res){
  var result = req.rawBody;
  res.send("hello there world data is " + result);
});
