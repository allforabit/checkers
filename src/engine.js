// import { Directions, PlayerColors } from './actions'

const PlayerColors = {
  RED: 'RED',
  YELLOW: 'YELLOW'
}

const Directions = {
  NORTH: -1,
  SOUTH: 1,
  BOTH: 0
}

const { RED, YELLOW } = PlayerColors
const { NORTH, SOUTH, BOTH } = Directions

export function checkForWinner(game){

  var yellowPiecesLeft = game.pieces
      .filter(function(piece){ return piece.captured !== true && piece.color === YELLOW })
      .length

  var redPiecesLeft = game.pieces
      .filter(function(piece){ return piece.captured !== true && piece.color === RED })
      .length

  if(yellowPiecesLeft === 0){
    return RED
  }else if(redPiecesLeft === 0){
    return YELLOW
  }else{
    return null
  }

}

export function checkPieceKinged(piece){

  if(piece.pos[1] === 7 && piece.color === RED){
    return true
  }

  if(piece.pos[1] === 0 && piece.color === YELLOW){
    return true
  }

  return false

}

export function checkIfMoveWasJump(pieces, newPos, previousPos){

  var capturedPiece = -1

  if(Math.abs(newPos[1] - previousPos[1]) > 1){
    var jumpedPieceXCoords = previousPos[0] - ((previousPos[0] - newPos[0]) / 2)
    var jumpedPieceYCoords = previousPos[1] - ((previousPos[1] - newPos[1]) / 2)
    var pos = [jumpedPieceXCoords, jumpedPieceYCoords]
    capturedPiece = getPieceIndexAtPos(pieces, pos)
  }

  return capturedPiece

}

export function getDirection(piece){

  if(piece.king === true){
    return BOTH;
  }

  if(piece.color === RED){
    return SOUTH;
  }else{
    return NORTH;
  }

};

export function checkFurtherMovesAvailable (pieces, piece){
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

function getListLegalMoves(pieces, pos, direction, iterations){

  var relativeCoordsList;
  //TODO constrain to board
  if(direction === BOTH){
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

function hasPiece(pieces, pos){
  return getPieceIndexAtPos(pieces, pos) >= 0
}


function hasEnemyPiece(pieces, pos, enemyColor){
  let pieceIndex = getPieceIndexAtPos(pieces, pos);
  if(pieceIndex < 0){
    return false;
  }
  let piece = pieces[pieceIndex]
  if(piece && (piece.color !== enemyColor)){
    return true
  }else{
    return false
  }
}

function getPieceIndexAtPos(pieces, pos){
  return pieces
    .findIndex( p => p.pos[0] === pos[0] && p.pos[1] === pos[1] && !p.captured )
}

export function checkLegalMove(pieces, selectedPiece, destPos){

  var isLegalMove = true

  var currentPos = selectedPiece.pos

  var listLegalMoves = getListLegalMoves(pieces, currentPos, getDirection(selectedPiece))

  var legalMove = listLegalMoves.filter( coord => coord[0] === destPos[0] && coord[1] === destPos[1] )

  if(legalMove.length < 1){
    isLegalMove = false
  }

  return isLegalMove

};
