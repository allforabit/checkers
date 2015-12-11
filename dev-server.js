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
var connectPlayer = actions.connectPlayer
var disconnectPlayer = actions.disconnectPlayer

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

function select(state, clientId) {

  if(clientId){
    return {
      me: state.players.find(function(player){ return player.id === clientId}),
      game: state.game
    }
  }else{
    return {
      game: state.game
    }
  }
}

store.subscribe(
  function(){ io.emit('state', select(store.getState())) }
)

io.on('connection', function(socket){

  store.dispatch(connectPlayer(socket.id))

  console.log('state', select(store.getState(), socket.id))
  socket.emit('state', select(store.getState(), socket.id))

  socket.on('hello', function(payload){
    console.log('hello')
    console.log(payload)
  })

  socket.on(SELECT_PIECE, function(payload){
    console.log('sel piece')
    var result = store.dispatch(selectPiece(payload))
    if(result.err){
      io.emit('state', select(store.getState()))
    }
  })

  socket.on(CLICK_CELL, function(payload){
    console.log('click cell')
    var result = store.dispatch(clickCell(payload))
    if(result.err){
      io.emit('state', select(store.getState()))
    }
  })

  socket.on(RESET_GAME, function(){
    store.dispatch(resetGame())
  })

  socket.on('disconnect', function () {
    store.dispatch(disconnectPlayer(socket.id))
    io.emit('state', select(store.getState(), socket.id))
  })

})

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

http.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
})
