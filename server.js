import path from 'path'
import express from 'express'
import Validator from 'redux-validator'

import http from 'http'
import socketIO from 'socket.io'

import { compose, createStore, applyMiddleware } from 'redux'

import rootReducer from './src/reducers'

import { Actions } from './src/constants'

import {
  clickCell,
  selectPiece,
  resetGame,
  connectPlayer,
  connectPlayers,
  disconnectPlayer,
  completeTurn
} from './src/actions'

import webpackDevMiddleWare from 'webpack-dev-middleware'
import webpackHotMiddleWare from 'webpack-hot-middleware'

import webpack from 'webpack'
import config from './webpack.config.dev'

const {
  SELECT_PIECE,
  CLICK_CELL,
  RESET_GAME,
  COMPLETE_TURN
} = Actions

const compiler = webpack(config)

const app = express()
const server = http.Server(app)

const io = socketIO(server)

const validator = Validator()

const finalCreateStore = compose(
  applyMiddleware(
    validator
  )
)(createStore)

const store = finalCreateStore(rootReducer)

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

// Validate that the correct player is making the move
function checkCorrectClientId(state, id){
  // Make sure it's the correct client id
  var state = store.getState()
  var game = state.game
  var players = state.players

  var clientId = players.find(function(player){ return player.color === game.currentPlayerColor }).id
  return clientId === id
}

store.subscribe(
  function(){ io.emit('state', select(store.getState())) }
)

io.on('connection', function(socket){

  store.dispatch(connectPlayers(Object.keys(io.sockets.connected)))

  socket.emit('state', select(store.getState(), socket.id))

  socket.on(SELECT_PIECE, function(payload){

    if(!checkCorrectClientId(store.getState(), socket.id)){
      io.emit('state', select(store.getState()))
      return
    }

    var result = store.dispatch(selectPiece(payload))
    if(result.err){
      io.emit('state', select(store.getState()))
    }

  })

  socket.on(CLICK_CELL, function(payload){
    if(!checkCorrectClientId(store.getState(), socket.id)){
      io.emit('state', select(store.getState()))
      return
    }
    var result = store.dispatch(clickCell(payload))
    if(result.err){
      io.emit('state', select(store.getState()))
    }
  })

  socket.on(COMPLETE_TURN, function(payload){
    if(!checkCorrectClientId(store.getState(), socket.id)){
      io.emit('state', select(store.getState()))
      return
    }
    var result = store.dispatch(completeTurn(payload))
    if(result.err){
      io.emit('state', select(store.getState()))
    }
  })

  socket.on(RESET_GAME, function(){
    store.dispatch(resetGame())
  })

})

app.use(webpackDevMiddleWare(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleWare(compiler));

app.use(express.static(__dirname + '/public'))
app.use('/static', express.static(__dirname + '/dist'))

server.listen(process.env.PORT || 3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }
})

export default server
