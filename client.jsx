'use strict'

//css
require('./style.scss');

var React = require('react')
var components = require('./components');
var Board = components.Board;
var Reflux = require('reflux');
var Morearty = require('morearty');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});

var state = {
  playerTurn: COLORS.RED,
  pieces: [
    {color: 'red', pos: [1,0]}, {color: 'red', pos: [3,0]}, {color: 'red', pos: [5,0]}, {color: 'red', pos: [7,0]}, {color: 'red', pos: [9,0]},
    {color: 'red', pos: [0,1]}, {color: 'red', pos: [2,1]}, {color: 'red', pos: [4,1]}, {color: 'red', pos: [6,1]}, {color: 'red', pos: [8,1]},
    {color: 'red', pos: [1,2]}, {color: 'red', pos: [3,2]}, {color: 'red', pos: [5,2]}, {color: 'red', pos: [7,2]}, {color: 'red', pos: [9,2]},
    {color: 'yellow', pos: [0,7]}, {color: 'yellow', pos: [2,7]}, {color: 'yellow', pos: [4,7]}, {color: 'yellow', pos: [6,7]}, {color: 'yellow', pos: [8,7]},
    {color: 'yellow', pos: [1,8]}, {color: 'yellow', pos: [3,8]}, {color: 'yellow', pos: [5,8]}, {color: 'yellow', pos: [7,8]}, {color: 'yellow', pos: [9,8]},
    {color: 'yellow', pos: [0,9]}, {color: 'yellow', pos: [2,9]}, {color: 'yellow', pos: [4,9]}, {color: 'yellow', pos: [6,9]}, {color: 'yellow', pos: [8,9]},
  ]
};

var Ctx = Morearty.createContext({initialState: state});

var Actions = Reflux.createActions([
  'add',
  'edit',
  'remove',
  'toggle',
  'toggleAll',
  'clearCompleted'
]);

Reflux.StoreMethods.getMoreartyContext = function() {
  return Ctx;
};

var Store = Reflux.createStore({
  listenables: Actions, //NOTE: read Reflux documentation.

  //NOTE: Here we can set our binding\sub-binding variables. 
  //Again, :D read Reflux documentation.
  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
    this.itemsBinding = this.rootBinding.sub('items');
  },

  onEdit: function (id, title) {
    /*
     NOTE:
     Here we have pure value (item.id). But we want to change binding.
     */
    var itemIndex = this.itemsBinding.get().findIndex(function(item) {
      return item.get('id') === id
    });
    var itemBinding = this.itemsBinding.sub(itemIndex);
    itemBinding
      .atomically()
      .set('title', title)
      .set('editing', false)
      .commit();
  }
});

var pieces = [
];


var Bootstrap = Ctx.bootstrap(Board);

React.render(<Bootstrap />, document.getElementById('content'))
