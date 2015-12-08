// Allow loading of es6 modules
require('babel-core/register')

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var reduxViaSocketIO = require('redux-via-socket.io')
var Validator = require('redux-validator')
var redux = require('redux')

var actions = require('./src/actions.js')
var PlayerColors = actions.PlayerColors
var CLICK_CELL = actions.CLICK_CELL

var rootReducer = require('./src/reducers.js')

var app = express()
var http = require('http').Server(app)

var compiler = webpack(config);
var io = require('socket.io')(http)

var outServerViaSocketIO = reduxViaSocketIO.outServerViaSocketIO
var inServerViaSocketIO = reduxViaSocketIO.inServerViaSocketIO

var compose = redux.compose
var createStore = redux.createStore
var applyMiddleware = redux.applyMiddleware

const validator = Validator()

var finalCreateStore = compose(
  applyMiddleware(
    validator,
    outServerViaSocketIO(io) // initialize for outcoming actions
  )
)(createStore)

var store = finalCreateStore(rootReducer)

// initialize for incoming actions
inServerViaSocketIO(io, store.dispatch);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
