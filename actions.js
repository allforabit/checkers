var Reflux = require('reflux');
module.exports = Reflux.createActions([
  'select',
  'activateCell',
  'updatePosition',
  'newGame',
  'updatePiece',
  'updateGame',
  'attemptCompleteTurn',
  'completeTurn',
  'move',
  'assignPlayer',
  'changePlayer',
  'canCompleteTurn',
  'mustCompleteTurn'
]);
