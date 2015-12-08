// Action types
export const SET_COUNTER = 'SET_COUNTER';
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// 'select',
// 'activateCell',
// 'updatePosition',
// 'newGame',
// 'updatePiece',
// 'updateGame',
// 'attemptCompleteTurn',
// 'completeTurn',
// 'move',
// 'assignPlayer',
// 'changePlayer',
// 'canCompleteTurn',
// 'mustCompleteTurn'

export function select(id) {
  return {
    type: SET_COUNTER,
    payload: value
  };
}

export function activateCell(id) {
  return {
    type: INCREMENT_COUNTER
  };
}

export function updatePosition(id) {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}

export function select() {
  return {
    type: INCREMENT_COUNTER
  };
}
