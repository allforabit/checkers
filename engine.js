var Immutable = require('immutable');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});
var DIRECTIONS = Object.freeze({NORTH: -1, SOUTH: 1, BOTH: 0});

var checkForWinner = function(pieces){

  var yellowPiecesLeft = pieces
      .filter(function(piece){ return piece.get('captured') !== true && piece.get('color') === COLORS.YELLOW })
      .count();

  var redPiecesLeft = pieces
      .filter(function(piece){ return piece.get('captured') !== true && piece.get('color') === COLORS.RED })
      .count();

  if(yellowPiecesLeft === 0){
    return COLORS.RED;
  }else if(redPiecesLeft === 0){
    return COLORS.YELLOW;
  }else{
    return null;
  }

}

var checkPieceKinged = function(piece){
  var kinged = false;

  if(piece.get(['pos', 1]) === 7 && piece.get('color') === COLORS.RED){
    kinged = true;
  }else if(piece.get(['pos', 1]) === 0 && piece.get('color') === COLORS.YELLOW){
    kinged = true;
  }

  return kinged;
}

var checkIfMoveWasJump = function(pieces, newPos, previousPos){

  var capturedPiece;

  if(Math.abs(newPos.get(1) - previousPos.get(1)) > 1){
    var jumpedPieceXCoords = previousPos.get(0) - ((previousPos.get(0) - newPos.get(0)) / 2);
    var jumpedPieceYCoords = previousPos.get(1) - ((previousPos.get(1) - newPos.get(1)) / 2);
    var pos = [jumpedPieceXCoords, jumpedPieceYCoords];
    capturedPiece = getPieceAtPos(pieces, pos);
  }

  return capturedPiece;

}

var getDirection = function(piece){

  if(piece.get('king') === true){
    return DIRECTIONS.BOTH;
  }

  if(piece.get('color') === COLORS.RED){
    return DIRECTIONS.SOUTH;
  }else{
    return DIRECTIONS.NORTH;
  }

};

var checkFurtherMovesAvailable = function(pieces, piece){
  return false;

  //TODO figure out how to do this best
  //Need to constrain to previous move
  var legalMoves = getListLegalMoves(piece.get('pos').toJS(), getDirection(piece));
  var legalMovesThatAreJumps = legalMoves.filter(function(coord){ return Math.abs(coord[1] - piece.get(['pos', 1])) > 1}).length;
  if(legalMovesThatAreJumps){
    return true;
  }else{
    return false;
  }
};

var getListLegalMoves = function(pieces, pos, direction, iterations){

  var relativeCoordsList;
  //TODO constrain to board
  if(direction === DIRECTIONS.BOTH){
    relativeCoordsList = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
  }else{
    relativeCoordsList = [[-1, 1*direction], [1, 1*direction]];
  }

  var legalMoves = relativeCoordsList.map( function(coord){
    return [coord[0] + pos[0], coord[1] + pos[1]];
  }).map(function(coord){
    if(hasPiece(pieces, coord)){
      if(hasEnemyPiece(pieces, coord)){
        //neighbour coordinates from enemy piece perspective
        return relativeCoordsList.map(function(enemyCoord){
          return [coord[0] + enemyCoord[0], coord[1] + enemyCoord[1]];
        }).filter(function(enemyCoord){
          //make sure there's no existing piece and the x axis of destination
          //cell is not equal to the source position. I.e. can only jump
          //horizontally. Slightly hackish!
          return !hasPiece(pieces, enemyCoord) && (enemyCoord[0] !== pos[0]);
        });
      }else{
        return [];
      }
    }else{
      return [coord];
    }
  })
  .filter(function(coord) {
    return coord !== null && coord.length > 0;
  }).reduce(function(a, b){
    return a.concat(b);
  }, []);

  return legalMoves;

}

var hasPiece = function(pieces, pos){
  var piece = getPieceAtPos(pieces, pos);
  if(piece){
    return true;
  }else{
    return false;
  }
}

var hasEnemyPiece = function(pieces, pos, enemyColor){
  var piece = getPieceAtPos(pieces, pos);
  if(piece && (piece.get('color') !== enemyColor)){
    return true;
  }else{
    return false;
  }
}

var getPieceAtPos = function(pieces, pos){
  return pieces
    .filter(function(p){ return p.getIn(['pos', 0]) === pos[0] && p.getIn(['pos', 1]) === pos[1]})
    .first();
}

var checkLegalMove = function(pieces, selectedPiece, destPos){

  var isLegalMove = true;

  var currentPos = selectedPiece.get('pos').toJS();

  var listLegalMoves = getListLegalMoves(pieces, currentPos, getDirection(selectedPiece));

  var legalMove = listLegalMoves.filter(function(coord){
    return coord[0] === destPos[0] && coord[1] === destPos[1];
  });

  if(legalMove.length < 1){
    isLegalMove = false;
  }

  return isLegalMove;

};

//TODO reduce api size
module.exports = {
  checkForWinner: checkForWinner,
  checkPieceKinged: checkPieceKinged,
  checkIfMoveWasJump: checkIfMoveWasJump,
  getDirection: getDirection,
  checkFurtherMovesAvailable: checkFurtherMovesAvailable,
  getListLegalMoves: getListLegalMoves,
  hasPiece: hasPiece,
  hasEnemyPiece: hasEnemyPiece,
  checkLegalMove: checkLegalMove
}
