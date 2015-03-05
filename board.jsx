var Morearty = require('morearty');
var Actions = require('./actions');

var Piece = require('./piece');

var Board = React.createClass({
  mixins: [Morearty.Mixin],
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  handleCompleteTurn: function(){
    Actions.completeTurn();
  },
  render: function() {

    var binding = this.getDefaultBinding();

    var currentPlayer = binding.get('currentPlayer');
    var canCompleteTurn = binding.get('canCompleteTurn');

    var piecesBinding = binding.sub('pieces');
    var pieces = piecesBinding.get();

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

        var cell = {
          color: color,
          pos: pos
        }

        var piece = pieces
          .filter(p => p.getIn(['pos', 0]) === xPos && p.getIn(['pos', 1]) === yPos)
          .first();

        var pieceIndex = piecesBinding.get().findIndex(function(p) {
          return p.getIn(['pos', 0]) === xPos && p.getIn(['pos', 1]) === yPos;
        });

        var key = xPos + yPos;

        if(pieceIndex >= 0){
          var binding = piecesBinding.sub(pieceIndex);
          boardCells.push(<BoardCell key={key} cell={cell} ><Piece binding={binding} key={key} currentPlayer={currentPlayer}></Piece></BoardCell>);
        }else{
          boardCells.push(<BoardCell key={key} cell={cell} />);
        }

        xPos++;

      }

      boardRows.push(<BoardRow key={yPos}>{boardCells}</BoardRow>);

      yPos++;

    }

    console.log(canCompleteTurn);

    if (canCompleteTurn) {
      console.log('canCompleteTurn');
      var completeTurn = <button onClick={this.handleCompleteTurn}>Complete turn</button>;
    }
    // var completeTurn = <button onClick={this.handleCompleteTurn}>Complete turn</button>;

    return (
      <div>
        <table>
          {boardRows}
        </table>
        <div> Turn - {currentPlayer}</div>
        {completeTurn}
      </div>
    );

  }
});

var BoardRow = React.createClass({
  render: function(){
    return (
      <tr className="board-row">
        {this.props.children}
      </tr>
    );
  }
});

var BoardCell = React.createClass({
  handleClick: function(evt) {
    Actions.updatePosition(this.props.cell);
  },
  render: function(){

    var cx = React.addons.classSet;
    var classes = cx({
      'board-cell': true,
      'board-cell-black': this.props.cell.color === 'black',
      'board-cell-white': this.props.cell.color === 'white'
    });

    return (
      <td className={classes} onClick={this.handleClick} >{this.props.children}</td>
    );

  }
});

module.exports = Board;
