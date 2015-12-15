var path = require('path')
var express = require('express')

var httpModule = require('http')
var socketIO = require('socket.io')

var app = express()
var http = httpModule.Server(app)

var io = socketIO(http)

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'))
})

http.listen(process.env.PORT || 3000)
