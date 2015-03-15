var Reflux = require('reflux');
module.exports = Reflux.createActions([
  'select',
  'activateCell',
  'updatePosition',
  'updatePiece',
  'attemptCompleteTurn',
  'completeTurn',
  'move',
  'assignPlayer',
  'changePlayer',
  'canCompleteTurn',
  'mustCompleteTurn'
]);
