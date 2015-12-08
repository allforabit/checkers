import {createAction} from 'redux-actions'
import {checkLegalMove} from './engine.js'

/*
 * action types
 */
export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SET_CURRENT_PLAYER_COLOR = 'SET_CURRENT_PLAYER_COLOR'
export const SELECT_PIECE = 'SELECT_PIECE'
export const CLICK_CELL = 'CLICK_CELL'

/*
 * other constants
 */
export const PlayerColors = {
  RED: 'RED',
  YELLOW: 'YELLOW'
}

export const Directions = {
  NORTH: -1,
  SOUTH: 1,
  BOTH: 0
}

//
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */
export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}

export function selectPiece(index) {
  return { type: SELECT_PIECE, index }
}

// export function clickCell(x, y) {
//   return { type: CLICK_CELL, x, y }
// }

export const clickCell = createAction(CLICK_CELL, payload => payload, () => ({
  validator: {
    payload: [ // if action.payload is not a map, use payload key to validate action.payload itself 
      {
        func: (payload, state) => checkLegalMove(state.game.pieces, state.game.pieces[state.game.selectedPieceIndex], payload),
        msg: 'Illegal move'
      // },
      // {
      //   func: (payload, state) => state.game.selectedPieceIndex,
      //   msg: 'Please select a piece first'
      }
    ]
  },
  // server: true
}));

