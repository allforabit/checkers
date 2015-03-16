var express = require('express');
var app = express();
var http = require('http').Server(app);

var Reflux = require('reflux');
var Immutable = require('immutable');
var Morearty = require('morearty');

var io = require('socket.io')(http);

var engine = require('./engine');
var state = require('./state');
var utils = require('./utils');

var Actions = Reflux.createActions([
  'updatePosition',
  'updatePiece',
  'updateGame',
  'assignPlayer',
  'changePlayer',
  'completeTurn',
  'playerConnect',
  'playerDisconnect',
  'canCompleteTurn',
  'mustCompleteTurn',
  'move',
  'newGame'
]);

var Ctx = require('./ctx');

Reflux.StoreMethods.getMoreartyContext = function() {
  return Ctx;
};

io.on('connection', function(socket){

  Actions.playerConnect(socket);

  // console.log('user connected: ' + socket.id);

  socket.on('disconnect', function(){
    Actions.playerDisconnect(socket);
  });

  socket.on('new game', function(){
    Actions.newGame();
    // Ctx.resetState();
  });

  socket.on('move attempt', function(pieceId, destPos){
    Actions.updatePosition(pieceId, destPos);
  });

  socket.on('complete turn', function(){
    console.log('complete --------------');
    Actions.completeTurn();
  });

  Actions.changePlayer.listen(function(color){
    io.emit('change player', color);
  });

  Actions.assignPlayer.listen(function(color){
    io.emit('assign player', color);
  });

  Actions.canCompleteTurn.listen(function(state){
    io.emit('can complete turn', state);
  });

  Actions.mustCompleteTurn.listen(function(state){
    io.emit('must complete turn', state);
  });

  Actions.updatePiece.listen(function(pieceId, pieceState){
    io.emit('update piece', pieceId, pieceState);
  });

  Actions.updateGame.listen(function(gameState){
    io.emit('update game', gameState);
  });


});

var Store = Reflux.createStore({
  listenables: Actions, //NOTE: read Reflux documentation.
  //NOTE: Here we can set our binding\sub-binding variables.
  //Again, :D read Reflux documentation.
  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
    this.piecesBinding = this.rootBinding.sub('pieces');
  },
  onNewGame: function(){
    //TODO find a better way of doing this
    //save player ids before reset
    var redPlayer = this.rootBinding.get('redPlayer');
    var yellowPlayer = this.rootBinding.get('yellowPlayer');

    this.getMoreartyContext().resetState();
    this.rootBinding.set('redPlayer', redPlayer);
    this.rootBinding.set('yellowPlayer', yellowPlayer);

    //restore player ids
    Actions.updateGame(this.rootBinding.toJS());

  },
  onPlayerConnect: function(socket){

    if(!this.rootBinding.get('redPlayer') && !(this._socketIsAssigned(socket.id))){
      this.rootBinding.set('redPlayer', socket.id);
      Actions.assignPlayer('red');
    }

    if(!this.rootBinding.get('yellowPlayer') && !(this._socketIsAssigned(socket.id))){
      this.rootBinding.set('yellowPlayer', socket.id);
      Actions.assignPlayer('yellow');
    }

    //when both players are assigned send game update
    if(this.rootBinding.get('yellowPlayer') && this.rootBinding.get('redPlayer')){
      this.sendGameStateUpdate();
    }

  },
  onPlayerDisconnect: function(socket){
    //clear players on disconnect
    if(this.rootBinding.get('redPlayer') === socket.id){
      this.rootBinding.set('redPlayer', null);
    }

    if(this.rootBinding.get('yellowPlayer') === socket.id){
      this.rootBinding.set('yellowPlayer', null);
    }

    console.log('user disconnected: ' + socket.id);
  },
  _socketIsAssigned: function(clientId){
    var clientIdIsAssigned = false;
    if(this.rootBinding.get('redPlayer') === clientId || this.rootBinding.get('yellowPlayer') === clientId){
      clientIdIsAssigned = true;
    }
    return clientIdIsAssigned;
  },
  //attempt position update
  onUpdatePosition: function(pieceId, destPos){

    var pieceBinding = utils.findPieceBindingById(this.piecesBinding, pieceId);
    var selectedPiece = pieceBinding.get();

    pieceBinding.set('pending', false);

    //TODO find better way of updating position
    //Make sure it is the correct color's turn
    if(this.rootBinding.get('currentPlayer') !== selectedPiece.get('color')){
      //will reset position
      Actions.updatePiece(pieceBinding.get('id'), pieceBinding.toJS());
      console.log('wrong color');
      return;
    }

    //User must complete turn
    if(this.rootBinding.get('mustCompleteTurn')){
      //will reset position
      Actions.updatePiece(pieceBinding.get('id'), pieceBinding.toJS());
      console.log('must complete turn');
      return;
    }

    if(!engine.checkLegalMove(this.piecesBinding.get(), pieceBinding.get(), destPos)){
      //will reset position
      Actions.updatePiece(pieceBinding.get('id'), pieceBinding.toJS());
      console.log('illegal move');
      return;
    }

    pieceBinding.set('pos', Immutable.List(destPos));

    //Player can now optionally complete turn
    this.rootBinding.set('canCompleteTurn', true);

    this.rootBinding.set('pending', true);

    if(!engine.checkFurtherMovesAvailable(this.piecesBinding.get(), pieceBinding.get())){
      this.rootBinding.set('mustCompleteTurn', true);
    }

    //Check if piece was kinged
    if(engine.checkPieceKinged(pieceBinding.get())){
      pieceBinding.set('king', true);
    }

    //Check if it was a jump
    var capturedPiece = engine.checkIfMoveWasJump(this.piecesBinding.get(), pieceBinding.get('pos'), selectedPiece.get('pos'));
    if(capturedPiece){
      var capturedPieceIndex = this.piecesBinding.get().findIndex(function(piece) {
        return piece.get('id') === capturedPiece.get('id');
      });
      var capturedPieceBinding = this.piecesBinding.sub(capturedPieceIndex);
      capturedPieceBinding.set('captured', true);
      capturedPieceBinding.set('pos', [-1, -1]);
      Actions.updatePiece(capturedPieceBinding.get('id'), capturedPieceBinding.toJS());
    }

    var winner = engine.checkForWinner(this.piecesBinding.get());

    if(winner){
      this.rootBinding.set('gameOver', true);
      this.rootBinding.set('winner', winner);
    }

    console.log(pieceBinding.toJS());

    Actions.updatePiece(pieceBinding.get('id'), pieceBinding.toJS());

    this.sendGameStateUpdate();

  },
  //update state on completion of turn
  onCompleteTurn: function(){
    if(!this.rootBinding.get('canCompleteTurn')){
      return;
    }

    //switch back canCompleteTurn flag
    this.rootBinding.set('canCompleteTurn', false);
    //switch back mustCompleteTurn flag
    this.rootBinding.set('mustCompleteTurn', false);

    var currentPlayer = this.rootBinding.get('currentPlayer');
    this.rootBinding.set('currentPlayer', (currentPlayer === 'red' ? 'yellow' : 'red'));

    this.sendGameStateUpdate();

  },
  sendGameStateUpdate: function(){

    var state = {
      canCompleteTurn: this.rootBinding.get('canCompleteTurn'),
      mustCompleteTurn: this.rootBinding.get('mustCompleteTurn'),
      currentPlayer: this.rootBinding.get('currentPlayer'),
      gameOver: this.rootBinding.get('gameOver'),
      winner: this.rootBinding.get('winner')
    };

    Actions.updateGame(state);

  }
});

app.use(express.static(__dirname + '/public'));

http.listen(process.env.PORT || 5000);

