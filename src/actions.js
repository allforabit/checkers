import {createAction} from 'redux-actions'
import {checkLegalMove} from './engine.js'

/*
 * action types
 */
export const CONNECT_PLAYER = 'CONNECT_PLAYER'
export const DISCONNECT_PLAYER = 'DISCONNECT_PLAYER'
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
  YELLOW: 'YELLOW',
  STALEMATE: 'STALEMATE'
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
        func: (payload, state) => {
          // Client validation is it the correct player making the move
          // (state.me only exists on client and has access to own player)
          if(state.me && state.me.id){
            return state.me.color === state.game.currentPlayerColor
          }
          return true
        },
        msg: 'You may not move your opponents pieces'
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

// Server side only
export const connectPlayer = createAction(CONNECT_PLAYER, payload => payload)
export const disconnectPlayer = createAction(DISCONNECT_PLAYER, payload => payload)

// Set state from server to client
export const setState = createAction(SET_STATE, payload => payload)
