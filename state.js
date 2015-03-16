module.exports = {
  me: null,
  winner: null,
  gameOver: false,
  currentPlayer: 'red',
  canCompleteTurn: false,
  mustCompleteTurn: false,
  pending: false,
  pieces: [
    {id: 1, color: 'red', pos: [1,0]}, {id:2, color: 'red', pos: [3,0]}, {id:3, color: 'red', pos: [5,0]}, {id: 4, color: 'red', pos: [7,0]},
    {id: 6, color: 'red', pos: [0,1]}, {id: 7, color: 'red', pos: [2,1]}, {id: 8, color: 'red', pos: [4,1]}, {id: 9, color: 'red', pos: [6,1]},
    {id: 11, color: 'red', pos: [1,2]}, {id: 12, color: 'red', pos: [3,2]}, {id: 13, color: 'red', pos: [5,2]}, {id: 14, color: 'red', pos: [7,2]},
    {id: 16, color: 'yellow', pos: [0,5]}, {id: 17, color: 'yellow', pos: [2,5]}, {id: 18, color: 'yellow', pos: [4,5]}, {id: 19, color: 'yellow', pos: [6,5]},
    {id: 21, color: 'yellow', pos: [1,6]}, {id: 22, color: 'yellow', pos: [3,6]}, {id: 23, color: 'yellow', pos: [5,6]}, {id: 24, color: 'yellow', pos: [7,6]},
    {id: 26, color: 'yellow', pos: [0,7]}, {id: 27, color: 'yellow', pos: [2,7]}, {id: 28, color: 'yellow', pos: [4,7]}, {id: 29, color: 'yellow', pos: [6,7]}
  ]
};
