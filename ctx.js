var Reflux = require('reflux');
var Morearty = require('morearty');
var Immutable = require('immutable');

var Actions = require('./actions');
var engine = require('./engine');
var utils = require('./utils');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});
var DIRECTIONS = Object.freeze({NORTH: -1, SOUTH: 1, BOTH: 0});

var state = require('./state');

var Ctx = Morearty.createContext({initialState: state});

Reflux.StoreMethods.getMoreartyContext = function() {
  return Ctx;
};

var Store = Reflux.createStore({
  listenables: Actions, //NOTE: read Reflux documentation.
  //NOTE: Here we can set our binding\sub-binding variables.
  //Again, :D read Reflux documentation.
  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
    this.piecesBinding = this.rootBinding.sub('pieces');
  },
  onNewGame: function(){
    // this.rootBinding.resetState();
  },
  onAssignPlayer: function(color){
    this.rootBinding.set('me', color);
  },
  onChangePlayer: function(color){
    this.rootBinding.set('currentPlayer', color);
  },
  onUpdatePiece: function(pieceId, pieceState){
    console.log(arguments);
    var pieceBinding = utils.findPieceBindingById(this.piecesBinding, pieceId);
    for (var key in pieceState) {
      if (pieceState.hasOwnProperty(key)) {
        var valueToSet = Immutable.fromJS(pieceState[key]);
        console.log(valueToSet);
        pieceBinding.set(key, valueToSet);
      }
    }
  },
  //on select event
  onSelect: function(id){

    //User must complete turn
    if(this.rootBinding.get('mustCompleteTurn')){
      return;
    }

    var pieceBinding = utils.findPieceBindingById(this.piecesBinding, id);

    if(pieceBinding.get('color') !== this.rootBinding.get('currentPlayer')){
      return;
    }

    this.unSelectAll();

    pieceBinding.set('selected', true);

  },
  onActivateCell: function(cell){
    //Make sure cell is white
    if(cell.color === 'white'){
      return;
    }

    var selectedPiece = this.getSelectedPiece();

    if(!selectedPiece){
      return;
    }

    this.unSelectAll();

    Actions.updatePosition(selectedPiece.get('id'), cell.pos);

  },
  onMove: function(pieceId, destPos){
    var pieceBinding = utils.findPieceBindingById(this.piecesBinding, pieceId);
    pieceBinding.set('pos', Immutable.List(destPos));
  },
  //update state on completion of turn
  onAttemptCompleteTurn: function(){
    if(!this.rootBinding.get('canCompleteTurn')){
      return;
    }
    Actions.completeTurn();
  },
  onCanCompleteTurn: function(state){
    this.rootBinding.set('canCompleteTurn', state);
  },
  onMustCompleteTurn: function(state){
    this.rootBinding.set('mustCompleteTurn', state);
  },
  getSelectedPiece: function(){
    var selectedPiece = this.piecesBinding.get()
      .filter(function(piece){ return piece.get('selected') === true}).first();
    return selectedPiece;
  },
  unSelectAll: function(){
    this.piecesBinding.update(function (pieces) {
      return pieces.map(function (piece) {
        return piece.set('selected', false);
      });
    });
  }
});

module.exports = Ctx;
