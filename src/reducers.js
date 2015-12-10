import { combineReducers } from 'redux'
import {handleActions} from 'redux-actions'

import {
  checkIfMoveWasJump,
  checkPieceKinged,
  checkForWinner,
  getDirection,
  getListLegalMoves
} from './engine.js'

import {
  ADD_TODO,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER,
  SELECT_PIECE,
  SET_CURRENT_PLAYER_COLOR,
  CLICK_CELL,
  SET_STATE,
  RESET_GAME,
  COMPLETE_TURN,
  PlayerColors
} from './actions'

const { RED, YELLOW } = PlayerColors

const defaultGameState = {
  currentPlayerColor: RED,
  selectedPiece: null,
  gameOver: false,
  winner: null,
  pieces: [
    {id: 1, color: RED, pos: [1,0]}, {id:2, color: RED, pos: [3,0]}, {id:3, color: RED, pos: [5,0]}, {id: 4, color: RED, pos: [7,0]},
    {id: 6, color: RED, pos: [0,1]}, {id: 7, color: RED, pos: [2,1]}, {id: 8, color: RED, pos: [4,1]}, {id: 9, color: RED, pos: [6,1]},
    {id: 11, color: RED, pos: [1,2]}, {id: 12, color: RED, pos: [3,2]}, {id: 13, color: RED, pos: [5,2]}, {id: 14, color: RED, pos: [7,2]},
    {id: 16, color: YELLOW, pos: [0,5]}, {id: 17, color: YELLOW, pos: [2,5]}, {id: 18, color: YELLOW, pos: [4,5]}, {id: 19, color: YELLOW, pos: [6,5]},
    {id: 21, color: YELLOW, pos: [1,6]}, {id: 22, color: YELLOW, pos: [3,6]}, {id: 23, color: YELLOW, pos: [5,6]}, {id: 24, color: YELLOW, pos: [7,6]},
    {id: 26, color: YELLOW, pos: [0,7]}, {id: 27, color: YELLOW, pos: [2,7]}, {id: 28, color: YELLOW, pos: [4,7]}, {id: 29, color: YELLOW, pos: [6,7]}
  ]
}

function currentPlayerColor(state = RED, action) {
  switch (action.type) {
    case SET_CURRENT_PLAYER_COLOR:
      return action.color
    default:
      return state
  }
}

// Convenience method to update an item in an array
function updateItemInArray(arr, index, update){
  return [
    ...arr.slice(0, index),
    Object.assign({}, arr[index], update),
    ...arr.slice(index + 1)
  ]
}

const game = handleActions({

  [RESET_GAME]: (state, action) => {
    return Object.assign(defaultGameState)
  },

  [SET_STATE]: (state, action) => {
    return action.payload
  },

  [SELECT_PIECE]: (state, action) => {
    // Unselect if equal to prev selection (toggle)
    if(action.payload === state.selectedPieceIndex){
      return Object.assign({}, state, {
        selectedPieceIndex: null
      })
    }

    return Object.assign({}, state, {
      selectedPieceIndex: action.payload
    })

  },

  [CLICK_CELL]: (state, action) => {

    let {pieces, selectedPieceIndex} = state
    let newPos = action.payload

    let selectedPiece = pieces[selectedPieceIndex]

    let capturedPieceIndex = checkIfMoveWasJump(pieces, newPos, selectedPiece.pos)

    if(capturedPieceIndex >= 0){
      pieces = updateItemInArray(pieces, capturedPieceIndex, {captured: true})
    }

    // Check if kinged
    let kinged = checkPieceKinged(newPos, selectedPiece.color)
    if(kinged){
      pieces = updateItemInArray(pieces, selectedPieceIndex, {king: true})
    }

    // Update position
    pieces = updateItemInArray(pieces, selectedPieceIndex, {pos: newPos})

    // Check for winner
    let winner = checkForWinner(pieces)

    if(winner){
      return Object.assign({}, state, {
        gameOver: true,
        winner: winner,
        canCompleteTurn: false,
        mustCompleteTurn: false,
        selectedPieceIndex: null,
        pieces: pieces
      })
    }

    // Check for further moves 
    // Legal moves that are jumps
    let furtherMovesAvailable = getListLegalMoves(pieces, newPos, getDirection(selectedPiece))
    if(capturedPieceIndex >= 0){
      if(furtherMovesAvailable.length > 0){

        let jumpMoves = furtherMovesAvailable
          .filter((posToCheck) => checkIfMoveWasJump(pieces, posToCheck, newPos) >= 0 )

        console.log(jumpMoves)

        if(jumpMoves.length > 0){
          return Object.assign({}, state, {
            canCompleteTurn: true,
            mustCompleteTurn: false,
            pieces: pieces
          })
        }

      }
    }


    return Object.assign({}, state, {
      canCompleteTurn: true,
      mustCompleteTurn: true,
      pieces: pieces
    })

  },

  [COMPLETE_TURN]: (state, action) => {

    return Object.assign({}, state, {
      selectedPieceIndex: null,
      canCompleteTurn: false,
      mustCompleteTurn: false,
      currentPlayerColor: state.currentPlayerColor === RED ? YELLOW : RED
    })

  }

}, defaultGameState);

const checkersApp = combineReducers({
  currentPlayerColor,
  game
})

export default checkersApp
