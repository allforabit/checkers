'use strict'

var React = require('react')
var components = require('./components');
var Board = components.Board;

require('./style.scss');

var pieces = [
  {color: 'red', pos: [1,0]}, {color: 'red', pos: [3,0]}, {color: 'red', pos: [5,0]}, {color: 'red', pos: [7,0]}, {color: 'red', pos: [9,0]},
  {color: 'red', pos: [0,1]}, {color: 'red', pos: [2,1]}, {color: 'red', pos: [4,1]}, {color: 'red', pos: [6,1]}, {color: 'red', pos: [8,1]},
  {color: 'red', pos: [1,2]}, {color: 'red', pos: [3,2]}, {color: 'red', pos: [5,2]}, {color: 'red', pos: [7,2]}, {color: 'red', pos: [9,2]},
  {color: 'yellow', pos: [0,7]}, {color: 'yellow', pos: [2,7]}, {color: 'yellow', pos: [4,7]}, {color: 'yellow', pos: [6,7]}, {color: 'yellow', pos: [8,7]},
  {color: 'yellow', pos: [1,8]}, {color: 'yellow', pos: [3,8]}, {color: 'yellow', pos: [5,8]}, {color: 'yellow', pos: [7,8]}, {color: 'yellow', pos: [9,8]},
  {color: 'yellow', pos: [0,9]}, {color: 'yellow', pos: [2,9]}, {color: 'yellow', pos: [4,9]}, {color: 'yellow', pos: [6,9]}, {color: 'yellow', pos: [8,9]},
];

var firstItem = pieces.filter(piece => piece.pos[0] === 0 && piece.pos[1] === 1).shift();

if(firstItem){
  console.log(firstItem);
}


React.renderComponent(<Board pieces={pieces} />, document.getElementById('content'))
