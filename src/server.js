// Allow loading of es6 modules
require('babel-core/register')

var path = require('path');
var express = require('express');
// var reduxViaSocketIO = require('redux-via-socket.io')
var redux = require('redux')

var actions = require('./actions.js')
var PlayerColors = actions.PlayerColors
var CLICK_CELL = actions.CLICK_CELL

var rootReducer = require('./reducers.js')

var app = express()
var http = require('http').Server(app)

var io = require('socket.io')(http)

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// var outServerViaSocketIO = reduxViaSocketIO.outServerViaSocketIO
// var inServerViaSocketIO = reduxViaSocketIO.inServerViaSocketIO

// var compose = redux.compose
// var createStore = redux.createStore
// var applyMiddleware = redux.applyMiddleware

// var finalCreateStore = compose(
//   applyMiddleware(
//     outServerViaSocketIO(io) // initialize for outcoming actions
//   )
// )(createStore)

// var store = finalCreateStore(rootReducer)

// // initialize for incoming actions
// inServerViaSocketIO(io, store.dispatch);

io.on('connection', function (socket) {
  console.log('connect')
  socket.on('hello', function (data) {
    console.log(data)
  })
})

http.listen(4000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:4000');
});
