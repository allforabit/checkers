var Morearty = require('morearty');
var Actions = require('./actions');

var Piece = require('./piece');

var Board = React.createClass({
  mixins: [Morearty.Mixin],
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  render: function() {

    console.log('render ---------------');

    var binding = this.getDefaultBinding();

    var piecesBinding = binding.sub('pieces');
    var pieces = piecesBinding.get();

    var cellsBinding = binding.sub('cells');
    var cells = cellsBinding.get();

    var cellCount = 8;

    var boardRows = [];

    var color = 'white';

    var xPos = 0;
    var yPos = 0;


    for (i = 0; i < cellCount; i++) {
      xPos = 0;

      var boardCells = [];

      //TODO dry up
      if(color === 'white'){
        color = 'black';
      }else{
        color = 'white';
      }

      for (j = 0; j < cellCount; j++) {
        if(color === 'white'){
          color = 'black';
        }else{
          color = 'white';
        }

        // var piece = pieces.filter(piece => ).shift();

        var pos = [xPos, yPos];

        var cell = cells
          .filter(c => c.getIn(['pos', 0]) === xPos && c.getIn(['pos', 1]) === yPos)
          .first();

        var cellIndex = cellsBinding.get().findIndex(function(c) {
          return c.getIn(['pos', 0]) === xPos && c.getIn(['pos', 1]) === yPos;
        });

        var cellBinding = cellsBinding.sub(cellIndex);

        var piece = pieces
          .filter(p => p.getIn(['pos', 0]) === xPos && p.getIn(['pos', 1]) === yPos)
          .first();

        var pieceIndex = piecesBinding.get().findIndex(function(p) {
          return p.getIn(['pos', 0]) === xPos && p.getIn(['pos', 1]) === yPos;
        });

        var key = xPos + yPos;

        if(pieceIndex >= 0){
          var binding = piecesBinding.sub(pieceIndex);
          boardCells.push(<BoardCell key={key} binding={cellBinding} ><Piece binding={binding} key={key} ></Piece></BoardCell>);
        }else{
          boardCells.push(<BoardCell key={key} binding={cellBinding} />);
        }

        xPos++;

      }

      boardRows.push(<BoardRow key={yPos}>{boardCells}</BoardRow>);

      yPos++;

    }

    return (
      <table onClick={this.handleClick}>
        {boardRows}
      </table>
    );

  }
});

var BoardRow = React.createClass({
  // mixins: [Morearty.Mixin],
  render: function(){
    return (
      <tr className="board-row">
        {this.props.children}
      </tr>
    );
  }
});

var BoardCell = React.createClass({
  // mixins: [Morearty.Mixin],
  handleClick: function(evt) {
    // var binding = this.getDefaultBinding();
    // var cell = binding.get();
    // Actions.updatePosition(cell.get('id'));
  },
  render: function(){
    // var binding = this.getDefaultBinding();
    // var cell = binding.get();

    // var cx = React.addons.classSet;
    // var classes = cx({
    //   'board-cell': true,
    //   'board-cell-black': cell.get('color') === 'black',
    //   'board-cell-white': cell.get('color') === 'white'
    // });
    var cx = React.addons.classSet;
    var classes = cx({
      'board-cell': true,
      'board-cell-black': true
    });

    return (
      <td className={classes} onClick={this.handleClick} >{this.props.children}</td>
    );

  }
});

module.exports = Board;
