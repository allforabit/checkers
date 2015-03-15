var express = require('express');
var app = express();
var http = require('http').Server(app);
var Immutable = require('immutable');
var Morearty = require('morearty');

var io = require('socket.io')(http);

var engine = require('./engine');
var state = require('./state');
var utils = require('./utils');

var Ctx = Morearty.createContext({initialState: state});
var rootBinding = Ctx.getBinding();

var piecesBinding = rootBinding.sub('pieces');

app.use(express.static(__dirname + '/public'));

var socketIsAssigned = function(clientId){
  var clientIdIsAssigned = false;
  if(rootBinding.get('redPlayer') === clientId || rootBinding.get('yellowPlayer') === clientId){
    clientIdIsAssigned = true;
  }
  return clientIdIsAssigned;
}

io.on('connection', function(socket){

  console.log('user connected: ' + socket.id);

  //semi-randomly assign players to connected sessions
  if(!rootBinding.get('redPlayer') && !(socketIsAssigned(socket.id))){
    rootBinding.set('redPlayer', socket.id);
    socket.emit('assign player', 'red');
  }

  if(!rootBinding.get('yellowPlayer') && !(socketIsAssigned(socket.id))){
    rootBinding.set('yellowPlayer', socket.id);
    socket.emit('assign player', 'yellow');
  }

  //when both players are assigned emit currentplayer event
  if(rootBinding.get('yellowPlayer') && rootBinding.get('redPlayer')){
    io.emit('change turn', rootBinding.get('currentPlayer'));
  }

  socket.on('disconnect', function(){
    //clear players on disconnect
    if(rootBinding.get('redPlayer') === socket.id){
      rootBinding.set('redPlayer', null);
    }

    if(rootBinding.get('yellowPlayer') === socket.id){
      rootBinding.set('yellowPlayer', null);
    }

    console.log('user disconnected: ' + socket.id);

  });

  socket.on('move attempt', function(pieceId, destPos){
    console.log(arguments);

    var pieceBinding = utils.findPieceBindingById(piecesBinding, pieceId);

    if(engine.checkLegalMove(piecesBinding.get(), pieceBinding.get(), destPos)){
      pieceBinding.set('pos', Immutable.List([destPos]));
      var currentPlayer = rootBinding.get('currentPlayer');

      rootBinding.set('currentPlayer', currentPlayer === 'red' ? 'yellow' : 'red');

      io.emit('move', pieceBinding.get('id'), destPos);
      io.emit('change turn', rootBinding.get('currentPlayer'));

    }

  });

});



http.listen(process.env.PORT || 5000);

