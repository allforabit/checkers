var Reflux = require('reflux');
var Morearty = require('morearty');
var Immutable = require('immutable');

var Actions = require('./actions');

var COLORS = Object.freeze({RED: 'red', YELLOW: 'yellow'});

var state = {id: 1, color: 'red', pos: [1,0]};

var Ctx = Morearty.createContext({initialState: state});

Reflux.StoreMethods.getMoreartyContext = function() {
  return Ctx;
};

var Store = Reflux.createStore({
  listenables: Actions, //NOTE: read Reflux documentation.
  //NOTE: Here we can set our binding\sub-binding variables.
  //Again, :D read Reflux documentation.
  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
  },
  onSelect: function(id){

    console.log(id);

    var pieceBinding = this.rootBinding;

    console.log(pieceBinding.toJS());

    pieceBinding.set('selected', true);

  },
  getSelectedPiece: function(){
    var selectedPiece = this.piecesBinding.get().filter(piece => piece.get('selected') === true).first();
    console.log(selectedPiece.toJS(), 'sel piece');
    return selectedPiece;
  }
});

module.exports = Ctx;
