var Reflux = require('reflux');
var Morearty = require('morearty');
var Immutable = require('immutable');

var Actions = require('./actions');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});

var generateCells = function(){

  var cellCount = 8;
  var cells = [];
  var color = 'white';
  var xPos = 0;
  var yPos = 0;

  for (var i = 0; i < cellCount; i++) {

    xPos = 0;

    var boardCells = [];

    //TODO: dry up
    if(color === 'white'){
      color = 'black';
    }else{
      color = 'white';
    }

    for (var j = 0; j < cellCount; j++) {
      if(color === 'white'){
        color = 'black';
      }else{
        color = 'white';
      }

      var pos = [xPos, yPos];
      var cell = {
        pos: pos,
        color: color,
        id: xPos + '-' + yPos
      }

      cells.push(cell);
      xPos++;

    }

    yPos++;

  }

  return cells;
}

var state = {
  playerTurn: COLORS.RED,
  pieces: [
    {id: 1, selected: true, color: 'red', pos: [1,0]}, {id:2, color: 'red', pos: [3,0]}, {id:3, color: 'red', pos: [5,0]}, {id: 4, color: 'red', pos: [7,0]},
    {id: 6, color: 'red', pos: [0,1]}, {id: 7, color: 'red', pos: [2,1]}, {id: 8, color: 'red', pos: [4,1]}, {id: 9, color: 'red', pos: [6,1]},
    {id: 11, color: 'red', pos: [1,2]}, {id: 12, color: 'red', pos: [3,2]}, {id: 13, color: 'red', pos: [5,2]}, {id: 14, color: 'red', pos: [7,2]},
    {id: 16, color: 'yellow', pos: [0,5]}, {id: 17, color: 'yellow', pos: [2,5]}, {id: 18, color: 'yellow', pos: [4,5]}, {id: 19, color: 'yellow', pos: [6,5]},
    {id: 21, color: 'yellow', pos: [1,6]}, {id: 22, color: 'yellow', pos: [3,6]}, {id: 23, color: 'yellow', pos: [5,6]}, {id: 24, color: 'yellow', pos: [7,6]},
    {id: 26, color: 'yellow', pos: [0,7]}, {id: 27, color: 'yellow', pos: [2,7]}, {id: 28, color: 'yellow', pos: [4,7]}, {id: 29, color: 'yellow', pos: [6,7]}
  ],
  cells: generateCells()
};

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
    this.cellsBinding = this.rootBinding.sub('cells');
  },
  onUpdatePosition: function(id){

    var cellIndex = this.cellsBinding.get().findIndex(function(cell) {
      return cell.get('id') === id;
    });

    var cellBinding = this.cellsBinding.sub(cellIndex);

    var cell = cellBinding.get();

    console.log(cell.toJS());

    if(cell.get('color') === 'white'){
      return;
    }

    var selectedPiece = this.getSelectedPiece();

    if(!selectedPiece){
      return;
    }

    //check x coords
    if(Math.abs(selectedPiece.getIn(['pos', 0]) - cell.getIn(['pos', 0])) !== 1){
      return;
    }

    //check y choords for yellow player
    if(selectedPiece.get('color') === 'yellow'){
      if(selectedPiece.getIn(['pos', 1]) - cell.getIn(['pos', 1]) !== 1){
        return;
      }
    }

    //check y choords for red player
    if(selectedPiece.get('color') === 'red'){
      if(selectedPiece.getIn(['pos', 1]) - cell.getIn(['pos', 1]) !== -1){
        return;
      }
    }

    this.unSelectAll();

    var pieceIndex = this.piecesBinding.get().findIndex(function(piece) {
      return piece.get('id') === selectedPiece.get('id');
    });

    var pieceBinding = this.piecesBinding.sub(pieceIndex);

    pieceBinding.set('pos', Immutable.List(cell.get('pos')));

  },
  checkEnemyNeighbours: function(startCell, endCell, direction){

  },
  checkLegalMove: function(cell){

  },
  onSelect: function(id){

    console.log(id);

    this.unSelectAll();

    var pieceIndex = this.piecesBinding.get().findIndex(function(piece) {
      return piece.get('id') === id
    });

    var pieceBinding = this.piecesBinding.sub(pieceIndex);

    console.log(pieceBinding.toJS());

    pieceBinding.set('selected', true);

  },
  getSelectedPiece: function(){
    var selectedPiece = this.piecesBinding.get().filter(piece => piece.get('selected') === true).first();
    console.log(selectedPiece.toJS(), 'sel piece');
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
