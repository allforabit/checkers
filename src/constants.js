/*
 * action constants
 */
export const Actions  = {
  CONNECT_PLAYER: 'CONNECT_PLAYER',
  CONNECT_PLAYERS: 'CONNECT_PLAYERS',
  DISCONNECT_PLAYER: 'DISCONNECT_PLAYER',
  SET_CURRENT_PLAYER_COLOR: 'SET_CURRENT_PLAYER_COLOR',
  SELECT_PIECE: 'SELECT_PIECE',
  CLICK_CELL: 'CLICK_CELL',
  SET_STATE: 'SET_STATE',
  RESET_GAME: 'RESET_GAME',
  COMPLETE_TURN: 'COMPLETE_TURN'
}

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
