'use strict'

//css
require('./style.scss');

// var socket = require('socket.io-client')('http://localhost:5000');
var socket = require('socket.io-client')();
var Reflux = require('reflux');
var Game = require('./game');
var Actions = require('./actions');
var Ctx = require('./ctx');

socket.on('assign player', function(color){
  Actions.assignPlayer(color);
});

socket.on('change player', function(color){
  Actions.changePlayer(color);
  console.log('color: ' + color);
});

socket.on('move', function(pieceId, destPos){
  Actions.move(pieceId, destPos);
});

socket.on('can complete turn', function(state){
  Actions.canCompleteTurn(state);
});

socket.on('must complete turn', function(state){
  Actions.mustCompleteTurn(state);
});

socket.on('update piece', function(pieceId, piece){
  Actions.updatePiece(pieceId, piece);
});

socket.on('update game', function(gameState){
  Actions.updateGame(gameState);
});

Actions.updatePosition.listen(function(pieceId, destPos){
  socket.emit('move attempt', pieceId, destPos);
});

Actions.completeTurn.listen(function(){
  socket.emit('complete turn');
});

Actions.newGame.listen(function(){
  socket.emit('new game');
});

var Bootstrap = Ctx.bootstrap(Game);

React.render(<Bootstrap />, document.getElementById('content'))
