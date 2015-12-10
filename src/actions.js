import {createAction} from 'redux-actions'
import {checkLegalMove} from './engine.js'

/*
 * action types
 */
export const SET_CURRENT_PLAYER_COLOR = 'SET_CURRENT_PLAYER_COLOR'
export const SELECT_PIECE = 'SELECT_PIECE'
export const CLICK_CELL = 'CLICK_CELL'
export const SET_STATE = 'SET_STATE'
export const RESET_GAME = 'RESET_GAME'
export const COMPLETE_TURN = 'COMPLETE_TURN'

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

/*
 * action creators
 */

export const selectPiece = createAction(SELECT_PIECE, payload => payload, () => ({
  validator: {
    payload: [
      {
        func: (payload, state) => state.game.currentPlayerColor === state.game.pieces[payload].color,
        msg: 'Please wait until it\'s your turn'
      },
      {
        func: (payload, state) => !state.game.mustCompleteTurn,
        msg: 'Please complete your turn'
      },
      // Can't select another piece mid move
      {
        func: (payload, state) => !state.game.canCompleteTurn,
        msg: 'Please complete your turn'
      }
    ]
  },
  remote: true
}))

export const clickCell = createAction(CLICK_CELL, payload => payload, () => ({
  validator: {
    payload: [ // if action.payload is not a map, use payload key to validate action.payload itself 
      {
        func: (payload, state) => state.game.selectedPieceIndex === null ? false : true,
        msg: 'Please select a piece first'
      },
      {
        func: (payload, state) => checkLegalMove(state.game.pieces, state.game.pieces[state.game.selectedPieceIndex], payload),
        msg: 'Illegal move'
      },
      {
        func: (payload, state) => !state.game.mustCompleteTurn,
        msg: 'Please complete your turn'
      }
    ]
  },
  remote: true
}))

export const resetGame = createAction(RESET_GAME, payload => payload, () => ({
  remote: true
}))

export const completeTurn = createAction(COMPLETE_TURN, payload => payload, () => ({
  validator: {
    payload: [ // if action.payload is not a map, use payload key to validate action.payload itself 
      {
        func: (payload, state) => state.game.canCompleteTurn ? true : false,
        msg: 'Please move a piece first'
      }
    ]
  },
  remote: true
}))

// Set state from server to client
export const setState = createAction(SET_STATE, payload => payload)
