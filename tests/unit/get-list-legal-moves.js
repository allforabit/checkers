require('babel-core/register')
var test = require('tape')

var engine = require('../../src/engine')
var getListLegalMoves = engine.getListLegalMoves
var checkForWinner = engine.checkForWinner

var SOUTH = 1 
var NORTH = -1 
var BOTH = 0 
var RED = 'RED'
var YELLOW = 'YELLOW'

const noMovesYellowGameState = {
  currentPlayerColor: RED,
  selectedPiece: null,
  gameOver: false,
  winner: null,
  pieces: [
    {color: RED, pos: [1,0]}, {color: RED, pos: [3,0]}, {color: RED, pos: [5,0]}, {color: RED, pos: [7,0]},
    {color: RED, pos: [0,1]}, {color: RED, pos: [2,1]}, {color: RED, pos: [4,1]}, {color: RED, pos: [6,1]},
    {color: RED, pos: [1,2]}, {color: RED, pos: [7,6]}, {color: RED, pos: [4,5]}, {color: RED, pos: [5,6]},
    {color: YELLOW, pos: [0,5], captured: true}, {color: YELLOW, pos: [2,5], captured: true}, {color: YELLOW, pos: [4,5], captured: true}, {color: YELLOW, pos: [6,5], captured: true},
    {color: YELLOW, pos: [1,6], captured: true}, {color: YELLOW, pos: [3,6], captured: true}, {color: YELLOW, pos: [5,6], captured: true}, {color: YELLOW, pos: [7,6], captured: true},
    {color: YELLOW, pos: [0,7], captured: true}, {color: YELLOW, pos: [2,7], captured: true}, {color: YELLOW, pos: [4,7], captured: true}, {color: YELLOW, pos: [6,7]}
  ]
}

const stalemateGameState = {
  currentPlayerColor: RED,
  selectedPiece: null,
  gameOver: false,
  winner: null,
  pieces: [
    {color: RED, pos: [1,0], captured: true}, {color: RED, pos: [3,0], captured: true}, {color: RED, pos: [5,0], captured: true}, {color: RED, pos: [7,0], captured: true},
    {color: RED, pos: [0,1], captured: true}, {color: RED, pos: [2,1], captured: true}, {color: RED, pos: [4,1], captured: true}, {color: RED, pos: [6,1], captured: true},
    {color: RED, pos: [1,2], captured: true}, {color: RED, pos: [6,5]}, {color: RED, pos: [4,5], captured: true}, {color: RED, pos: [5,6], captured: true},
    {color: YELLOW, pos: [0,5], captured: true}, {color: YELLOW, pos: [2,5], captured: true}, {color: YELLOW, pos: [4,5], captured: true}, {color: YELLOW, pos: [6,5], captured: true},
    {color: YELLOW, pos: [1,6], captured: true}, {color: YELLOW, pos: [3,6], captured: true}, {color: YELLOW, pos: [5,6], captured: true}, {color: YELLOW, pos: [7,6], captured: true},
    {color: YELLOW, pos: [0,7], captured: true}, {color: YELLOW, pos: [2,7], captured: true}, {color: YELLOW, pos: [4,7], captured: true}, {color: YELLOW, pos: [6,7]}
  ]
}

test('no moves yellow', function (t) {
  t.equal(getListLegalMoves(noMovesYellowGameState.pieces, {pos: [6, 7], color: YELLOW}, NORTH).length, 0)
  t.end()
})

test('moves available red', function (t) {

  var redPiecesLeft = noMovesYellowGameState.pieces
      .filter(function(piece){ return piece.captured !== true && piece.color === RED })

  var redMovesLeft = redPiecesLeft
    .filter(function(piece){ return getListLegalMoves(redPiecesLeft, {pos: [2, 1], color: RED}, SOUTH).length > 0 })

  t.equal(redMovesLeft.length > 0, true)

  t.end()
})


test('no moves yellow, check winner', function (t) {
  t.equal(checkForWinner(noMovesYellowGameState.pieces), RED)
  t.end()
})
