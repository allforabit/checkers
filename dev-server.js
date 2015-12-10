// Allow loading of es6 modules
require('babel-core/register')

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var Validator = require('redux-validator')
var redux = require('redux')

var actions = require('./src/actions.js')
var sendState = actions.sendState

var CLICK_CELL = actions.CLICK_CELL
var SELECT_PIECE = actions.SELECT_PIECE
var RESET_GAME = actions.RESET_GAME

var clickCell = actions.clickCell
var selectPiece = actions.selectPiece
var resetGame = actions.resetGame

var rootReducer = require('./src/reducers.js')

var app = express()
var http = require('http').Server(app)

var compiler = webpack(config);
var io = require('socket.io')(http)

var compose = redux.compose
var createStore = redux.createStore
var applyMiddleware = redux.applyMiddleware

const validator = Validator()

var finalCreateStore = compose(
  applyMiddleware(
    validator
  )
)(createStore)

var store = finalCreateStore(rootReducer)

store.subscribe(
  function(){ io.emit('state', store.getState().game) }
)

io.on('connection', function(socket){

  socket.emit('state', store.getState().game)

  socket.on(SELECT_PIECE, function(payload){
    var result = store.dispatch(selectPiece(payload))
    if(result.err){
      io.emit('state', store.getState().game)
    }
  })

  socket.on(CLICK_CELL, function(payload){
    var result = store.dispatch(clickCell(payload))
    if(result.err){
      io.emit('state', store.getState().game)
    }
  })

  socket.on(RESET_GAME, function(){
    var result = store.dispatch(resetGame())
  })

})

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
