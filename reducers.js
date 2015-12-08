import { combineReducers } from 'redux';
import { SET_COUNTER, INCREMENT_COUNTER, DECREMENT_COUNTER } from './actions';

function game(state = {}, action) {
  switch (action.type) {
  case SET_COUNTER:
    return action.payload;
  case INCREMENT_COUNTER:
    return state;
  case DECREMENT_COUNTER:
    return state;
  default:
    return state;
  }
}

export default combineReducers({
  game
});
