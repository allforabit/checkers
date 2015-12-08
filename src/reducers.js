import { combineReducers } from 'redux'
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, SELECT_PIECE, SET_CURRENT_PLAYER_COLOR, CLICK_CELL, PlayerColors, VisibilityFilters } from './actions'
const { RED, YELLOW } = PlayerColors
const { SHOW_ALL  } = VisibilityFilters
import {checkIfMoveWasJump} from './engine.js'

const defaultPieces =  [
  {id: 1, color: RED, pos: [1,0]}, {id:2, color: RED, pos: [3,0]}, {id:3, color: RED, pos: [5,0]}, {id: 4, color: RED, pos: [7,0]},
  {id: 6, color: RED, pos: [0,1]}, {id: 7, color: RED, pos: [2,1]}, {id: 8, color: RED, pos: [4,1]}, {id: 9, color: RED, pos: [6,1]},
  {id: 11, color: RED, pos: [1,2]}, {id: 12, color: RED, pos: [3,2]}, {id: 13, color: RED, pos: [5,2]}, {id: 14, color: RED, pos: [7,2]},
  {id: 16, color: YELLOW, pos: [0,5]}, {id: 17, color: YELLOW, pos: [2,5]}, {id: 18, color: YELLOW, pos: [4,5]}, {id: 19, color: YELLOW, pos: [6,5]},
  {id: 21, color: YELLOW, pos: [1,6]}, {id: 22, color: YELLOW, pos: [3,6]}, {id: 23, color: YELLOW, pos: [5,6]}, {id: 24, color: YELLOW, pos: [7,6]},
  {id: 26, color: YELLOW, pos: [0,7]}, {id: 27, color: YELLOW, pos: [2,7]}, {id: 28, color: YELLOW, pos: [4,7]}, {id: 29, color: YELLOW, pos: [6,7]}
]

function currentPlayerColor(state = RED, action) {
  switch (action.type) {
    case SET_CURRENT_PLAYER_COLOR:
      return action.color
    default:
      return state
  }
}

function game(state = {pieces: defaultPieces, selectedPieceIndex: null}, action){
  switch (action.type) {
    case SELECT_PIECE:
      // Unselect if equal to prev selection (toggle)
      if(action.index === state.selectedPieceIndex){
        return Object.assign({}, state, {
          selectedPieceIndex: null
        })
      }

      return Object.assign({}, state, {
        selectedPieceIndex: action.index
      })

    case CLICK_CELL:

      let {pieces, selectedPieceIndex} = state
      let newPos = action.payload

      let selectedPiece = pieces[selectedPieceIndex]

      let capturedPieceIndex = checkIfMoveWasJump(pieces, newPos, selectedPiece.pos)

      if(capturedPieceIndex){

        let capturedPiece = state.pieces[capturedPieceIndex]

        pieces = [
          ...pieces.slice(0, capturedPieceIndex),
          Object.assign({}, capturedPiece, {
            captured: true
          }),
          ...pieces.slice(capturedPieceIndex + 1)
        ]
      }

      pieces = [
        ...pieces.slice(0, selectedPieceIndex),
        Object.assign({}, selectedPiece, {
          pos: newPos
        }),
        ...pieces.slice(selectedPieceIndex + 1)
      ]

      return Object.assign({}, state, {
        selectedPieceIndex: null,
        pieces: pieces
      })


    default:
      return state
  }
}

const checkersApp = combineReducers({
  currentPlayerColor,
  game
})

export default checkersApp
