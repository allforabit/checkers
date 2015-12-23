import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import {
  checkIfMoveWasJump,
  checkPieceKinged,
  checkFurtherMovesAvailable,
  checkForWinner,
  getDirection,
  getListLegalMoves
} from './engine.js'

import { PlayerColors, Actions } from './constants'

const { RED, YELLOW } = PlayerColors

const {
  ADD_TODO,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER,
  SELECT_PIECE,
  SET_CURRENT_PLAYER_COLOR,
  CLICK_CELL,
  SET_STATE,
  RESET_GAME,
  COMPLETE_TURN,
  CONNECT_PLAYER,
  CONNECT_PLAYERS,
  DISCONNECT_PLAYER
} = Actions

const defaultGameState = {
  currentPlayerColor: RED,
  selectedPiece: null,
  gameOver: false,
  winner: null,
  pieces: [
    {color: RED, pos: [1,0]}, {color: RED, pos: [3,0]}, {color: RED, pos: [5,0]}, {color: RED, pos: [7,0]},
    {color: RED, pos: [0,1]}, {color: RED, pos: [2,1]}, {color: RED, pos: [4,1]}, {color: RED, pos: [6,1]},
    {color: RED, pos: [1,2]}, {color: RED, pos: [3,2]}, {color: RED, pos: [5,2]}, {color: RED, pos: [7,2]},
    {color: YELLOW, pos: [0,5]}, {color: YELLOW, pos: [2,5]}, {color: YELLOW, pos: [4,5]}, {color: YELLOW, pos: [6,5]},
    {color: YELLOW, pos: [1,6]}, {color: YELLOW, pos: [3,6]}, {color: YELLOW, pos: [5,6]}, {color: YELLOW, pos: [7,6]},
    {color: YELLOW, pos: [0,7]}, {color: YELLOW, pos: [2,7]}, {color: YELLOW, pos: [4,7]}, {color: YELLOW, pos: [6,7]}
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
  [SET_STATE]: (state, action) => {
    return action.payload.game
  },
  [RESET_GAME]: (state, action) => {
    return Object.assign(defaultGameState)
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

    // Check if king
    let king = checkPieceKinged(newPos, selectedPiece.color)
    if(king){
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
    let furtherMovesAvailable = checkFurtherMovesAvailable(
      pieces,
      {
        color: selectedPiece.color,
        king: king || selectedPiece.king,
        pos: newPos
      },
      capturedPieceIndex
    )

    if(furtherMovesAvailable){
      return Object.assign({}, state, {
        canCompleteTurn: true,
        mustCompleteTurn: false,
        pieces: pieces
      })
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

// Server side
const players = handleActions({
  [CONNECT_PLAYERS]: (state, action) => {

    // Colors to be assigned to connected players
    let colors = [RED, YELLOW]
    // Connected player ids
    let ids = Object.assign([], action.payload)
    // Previously connected players
    let players = Object.assign([], state)

    // Cycle through previously connected players and remove any players that are no longer connected.
    // For players that are still connected remove the relevant id and color so that it won't be reassigned.
    players.forEach((player, index) => {
      if(ids.indexOf(player.id) < 0){
        players.splice(index, 1)
      }else{
        colors.splice(colors.indexOf(player.color), 1)
        ids.splice(ids.indexOf(player.id), 1)
      }
    })

    // Cycle through an remaining ids that aren't already assigned to a player and assign a color.
    // It's done on a first come, first served basis so after two players have been assigned the available colors,
    // subsequent players will not be assigned any colors and so will be allowed to view the game but not participate.
    ids.forEach((id, index) => {
      players.push({
        id: id,
        color: colors[index]
      })
    })

    return players

  }
}, [{id: 'atest', color: RED}])

// Client side
const me = handleActions({
  [SET_STATE]: (state, action) => {

    if(action.payload.me){
      return action.payload.me
    }

    return state

  }
}, {})


const checkersApp = combineReducers({
  currentPlayerColor,
  game,
  players,
  me
})

export default checkersApp
