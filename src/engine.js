// import { Directions, PlayerColors } from './actions'

const PlayerColors = {
  RED: 'RED',
  YELLOW: 'YELLOW',
  STALEMATE: 'STALEMATE'
}

const Directions = {
  NORTH: -1,
  SOUTH: 1,
  BOTH: 0
}

const { RED, YELLOW, STALEMATE } = PlayerColors
const { NORTH, SOUTH, BOTH } = Directions

export function checkForWinner(pieces){

  let yellowPiecesLeft = pieces
      .filter(function(piece){ return piece.captured !== true && piece.color === YELLOW })

  let redPiecesLeft = pieces
      .filter(function(piece){ return piece.captured !== true && piece.color === RED })

  if(yellowPiecesLeft.length === 0){
    return RED
  }else if(redPiecesLeft.length === 0){
    return YELLOW
  }

  let yellowMovesLeft = yellowPiecesLeft
    .filter((piece) => getListLegalMoves(pieces, piece).length > 0 )

  let redMovesLeft = redPiecesLeft
    .filter((piece) => getListLegalMoves(pieces, piece).length > 0 )


  if(yellowMovesLeft.length === 0 && redMovesLeft.length === 0){
    return STALEMATE
  }

  if(redMovesLeft.length === 0 ){
    return YELLOW
  }

  if(yellowMovesLeft.length === 0){
    return RED
  }

  return null
}

export function checkPieceKinged(pos, color){

  if(pos[1] === 7 && color === RED){
    return true
  }

  if(pos[1] === 0 && color === YELLOW){
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

}

export function checkFurtherMovesAvailable (pieces, piece){
  let furtherMovesAvailable = getListLegalMoves(pieces, piece)
  if(capturedPieceIndex >= 0){
    if(furtherMovesAvailable.length > 0){

      let jumpMoves = furtherMovesAvailable
        .filter((posToCheck) => checkIfMoveWasJump(pieces, posToCheck, newPos) >= 0 )

      if(jumpMoves.length > 0){
        return Object.assign({}, state, {
          canCompleteTurn: true,
          mustCompleteTurn: false,
          pieces: pieces
        })
      }

    }
  }
}

export function getListLegalMoves(pieces, piece){

  let direction = getDirection(piece)
  let pos = piece.pos
  let color = piece.color

  let relativeCoordsList
  if(direction === BOTH){
    relativeCoordsList = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
  }else{
    relativeCoordsList = [[-1, 1*direction], [1, 1*direction]];
  }

  let legalMoves = relativeCoordsList.map( (coord) => [coord[0] + pos[0], coord[1] + pos[1]])
  .map(function(coord){
    // An existing piece occupies this coordinate
    if(hasPiece(pieces, coord)){
      if(hasEnemyPiece(pieces, coord, color)){
        //neighbour coordinates from enemy piece perspective
        return relativeCoordsList.map(function(enemyCoord){
          return [coord[0] + enemyCoord[0], coord[1] + enemyCoord[1]];
        }).filter(function(enemyCoord){
          //make sure there's no existing piece and the x axis of destination
          //cell is not equal to the source position. I.e. can only jump
          //horizontally. Slightly hackish!
          return !hasPiece(pieces, enemyCoord) && (enemyCoord[0] !== pos[0]);
        })
      }else{
        return []
      }
    }else{
      return [coord]
    }
  })
  .filter((coord) => coord !== null && coord.length > 0)
  // Flatten
  .reduce((a, b) => a.concat(b), [])
  // Filter to restrict to board
  .filter((coord) => coord[0] < 8 && coord[1] < 8)

  return legalMoves;

}

function hasPiece(pieces, pos){
  return getPieceIndexAtPos(pieces, pos) >= 0
}

function hasEnemyPiece(pieces, pos, color){
  let pieceIndex = getPieceIndexAtPos(pieces, pos);
  if(pieceIndex < 0){
    return false;
  }
  let piece = pieces[pieceIndex]
  if(piece && piece.color === color){
    return false
  }else{
    return true
  }
}

function getPieceIndexAtPos(pieces, pos){
  return pieces
    .findIndex( p => p.pos[0] === pos[0] && p.pos[1] === pos[1] && !p.captured )
}

export function checkLegalMove(pieces, selectedPiece, destPos){

  var isLegalMove = true

  var currentPos = selectedPiece.pos

  var listLegalMoves = getListLegalMoves(pieces, selectedPiece)

  var legalMove = listLegalMoves.filter( coord => coord[0] === destPos[0] && coord[1] === destPos[1] )

  if(legalMove.length < 1){
    isLegalMove = false
  }

  return isLegalMove

}
