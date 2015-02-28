var express = require('express');
var server = express(); // better instead

server.use(express.static(__dirname + '/public'));

server.listen(3000);

var grid = [{color: 'black'}, {color: 'white', color: 'black'}];
