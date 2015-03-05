var Reflux = require('reflux');
var Morearty = require('morearty');
var Immutable = require('immutable');

var Actions = require('./actions');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});
var DIRECTIONS = Object.freeze({NORTH: 1, SOUTH: -1, BOTH: 0});


var state = {
  currentPlayer: COLORS.RED,
  canCompleteTurn: false,
  mustCompleteTurn: false,
  pieces: [
    {id: 1, selected: true, color: 'red', pos: [1,0]}, {id:2, color: 'red', pos: [3,0]}, {id:3, color: 'red', pos: [5,0]}, {id: 4, color: 'red', pos: [7,0]},
    {id: 6, color: 'red', pos: [0,1]}, {id: 7, color: 'red', pos: [2,1]}, {id: 8, color: 'red', pos: [4,1]}, {id: 9, color: 'red', pos: [6,1]},
    {id: 11, color: 'red', pos: [1,2]}, {id: 12, color: 'red', pos: [3,2]}, {id: 13, color: 'red', pos: [5,2]}, {id: 14, color: 'red', pos: [7,2]},
    {id: 16, color: 'yellow', pos: [0,5]}, {id: 17, color: 'yellow', pos: [2,5]}, {id: 18, color: 'yellow', pos: [4,5]}, {id: 19, color: 'yellow', pos: [6,5]},
    {id: 21, color: 'yellow', pos: [1,6]}, {id: 22, color: 'yellow', pos: [3,6]}, {id: 23, color: 'yellow', pos: [5,6]}, {id: 24, color: 'yellow', pos: [7,6]},
    {id: 26, color: 'yellow', pos: [0,7]}, {id: 27, color: 'yellow', pos: [2,7]}, {id: 28, color: 'yellow', pos: [4,7]}, {id: 29, color: 'yellow', pos: [6,7]}
  ]
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
  },
  findPieceById: function(id){
    var pieceIndex = this.piecesBinding.get().findIndex(function(piece) {
      return piece.get('id') === id
    });
    return this.piecesBinding.sub(pieceIndex);
  },
  //on select event
  onSelect: function(id){

    //User must complete turn
    if(this.rootBinding.get('mustCompleteTurn')){
      return;
    }

    var pieceBinding = this.findPieceById(id);

    if(pieceBinding.get('color') !== this.rootBinding.get('currentPlayer')){
      return;
    }

    this.unSelectAll();

    pieceBinding.set('selected', true);

  },
  //on updated position event
  onUpdatePosition: function(cell){

    //Make sure cell is white
    if(cell.color === 'white'){
      return;
    }

    //User must complete turn
    if(this.rootBinding.get('mustCompleteTurn')){
      return;
    }

    var selectedPiece = this.getSelectedPiece();

    //Make sure it is the correct color's turn
    if(this.rootBinding.get('currentPlayer') !== selectedPiece.get('color')){
      return;
    }

    if(!this.checkLegalMove(cell)){
      return;
    }

    this.unSelectAll();

    var pieceIndex = this.piecesBinding.get().findIndex(function(piece) {
      return piece.get('id') === selectedPiece.get('id');
    });

    var pieceBinding = this.piecesBinding.sub(pieceIndex);

    pieceBinding.set('pos', Immutable.List(cell.pos));

    this.rootBinding.set('canCompleteTurn', true);

    if(!this.checkFurtherMovesAvailable()){
      this.rootBinding.set('mustCompleteTurn', true);
    }

    //TODO was it a jump. if so update piece in question

  },
  checkFurtherMovesAvailable: function(){
    return false;
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

    this.switchPlayer();

  },
  switchPlayer: function(){

    var currentPlayer = this.rootBinding.get('currentPlayer');
    if(currentPlayer === COLORS.RED){
      this.rootBinding.set('currentPlayer', COLORS.YELLOW);
    }else{
      this.rootBinding.set('currentPlayer', COLORS.RED);
    }

  },
  getListLegalMoves: function(pos, direction, legalMovesList, iterations){

    //TODO constrain to board
    console.log(direction);
    iterations = iterations || 0;
    legalMovesList = [] || legalMovesList;

    var coordsList = [[-1, 1*direction], [1, 1*direction]];

    coordsList.forEach(function(coord){

      var cellPos = [coord[0] + pos[0], coord[1] + pos[1]];

      if(this.hasPiece(cellPos)){
        if(this.hasEnemyPiece(cellPos) & iterations < 2){
          this.getListLegalMoves(cellPos, direction, legalMovesList, iterations);
        }
      }else{
        legalMovesList.push(cellPos);
      }
    }, this);

    iterations++;

    return legalMovesList;

  },
  hasPiece: function(pos){

    var piece = this.getPieceAtPos(pos);

    if(piece){
      return true;
    }else{
      return false;
    }

  },
  hasEnemyPiece: function(pos){

    var piece = this.getPieceAtPos(pos);
    var currentPlayer = this.rootBinding.get('currentPlayer');

    if(piece && (piece.get('color') !== currentPlayer)){
      return true;
    }else{
      return false;
    }
  },
  getPieceAtPos: function(pos){
    return this.rootBinding.get('pieces')
      .filter(p => p.getIn(['pos', 0]) === pos[0] && p.getIn(['pos', 1]) === pos[1])
      .first();
  },
  getNeighbours: function(cell, direction){

  },
  checkEnemyNeighbours: function(startCell, endCell, direction){

  },
  checkLegalMove: function(cell){

    var selectedPiece = this.getSelectedPiece();

    var isLegalMove = true;

    if(!selectedPiece){
      isLegalMove = false;
    }

    var listLegalMoves = this.getListLegalMoves(cell.pos, 1);

    console.log(listLegalMoves);

    //check x coords
    if(Math.abs(selectedPiece.getIn(['pos', 0]) - cell.pos[0]) !== 1){
      isLegalMove = false;
    }

    //check y choords for yellow player
    if(selectedPiece.get('color') === 'yellow'){
      if((selectedPiece.getIn(['pos', 1]) - cell.pos[1]) !== 1){
        isLegalMove = false;
      }
    }

    //check y choords for red player
    if(selectedPiece.get('color') === 'red'){
      if((selectedPiece.getIn(['pos', 1]) - cell.pos[1]) !== -1){
        isLegalMove = false;
      }
    }

    return isLegalMove;

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
