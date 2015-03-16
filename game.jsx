var Morearty = require('morearty');
var Actions = require('./actions');

var Piece = require('./piece');

var React = require('react');
var $ = require('jquery');

var Game = React.createClass({
  mixins: [Morearty.Mixin],
  render: function() {
    var binding = this.getDefaultBinding();
    if(binding.get('gameOver')){
      return (
        <GameOver binding={binding} />
      );
    }else{
      return (
        <Board binding={binding} />
      );
    }
  }
});

var Board = React.createClass({
  mixins: [Morearty.Mixin],
  componentDidMount: function() {
    $(document.body).on('keydown', this.handleKeyDown);
  },
  componentWillUnmount: function() {
    $(document.body).off('keydown', this.handleKeyDown);
  },
  handleCompleteTurn: function(){
    Actions.attemptCompleteTurn();
  },
  handleNewGame: function(){
    Actions.newGame();
  },
  handleKeyDown: function(e) {

    var SPACEBAR = 13;
    var ENTER = 32;

    if( e.keyCode === ENTER || e.keyCode === SPACEBAR) {
      e.preventDefault();
      Actions.completeTurn();
    }

  },
  render: function() {

    var binding = this.getDefaultBinding();

    var currentPlayer = binding.get('currentPlayer');
    var canCompleteTurn = binding.get('canCompleteTurn');
    var pending = binding.get('pending');

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
          .filter(p => p.getIn(['pos', 0]) === xPos
              && p.getIn(['pos', 1]) === yPos
              && p.get('captured') !== true)
          .first();

        var pieceIndex = piecesBinding.get().findIndex(function(p) {
          return p.getIn(['pos', 0]) === xPos
            && p.get('captured') !== true
            && p.getIn(['pos', 1]) === yPos;
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

    if (canCompleteTurn) {
      console.log('canCompleteTurn');
      var completeTurn = <button className="button mb1 bg-fuchsia" onClick={this.handleCompleteTurn}>Complete turn</button>;
    }

    var redCapturedEnemyPiecesCount = pieces
      .filter(piece => piece.get('color') === 'yellow' && piece.get('captured') === true )
      .count();

    var yellowCapturedEnemyPiecesCount = pieces
      .filter(piece => piece.get('color') === 'red' && piece.get('captured') === true )
      .count();

    // var completeTurn = <button onClick={this.handleCompleteTurn}>Complete turn</button>;

    var style;

    if(pending){
      style = {opacity: '0.4'};
    }

    return (
      <div style={style}>
        <button className="button mb1 bg-gray" onClick={this.handleNewGame}>New game</button>
        <table>
          {boardRows}
        </table>
        <div> Turn - {currentPlayer}</div>
        {completeTurn}
        <div>
          <h3>Captured enemy pieces</h3>
          <div> Red - {redCapturedEnemyPiecesCount}</div>
          <div> Yellow - {yellowCapturedEnemyPiecesCount}</div>
        </div>

      </div>
    );

  }
});

var GameOver = React.createClass({
  mixins: [Morearty.Mixin],
  handleClick: function(evt){
    Actions.newGame();
  },
  render: function(){
    var binding = this.getDefaultBinding();
    var winner = binding.get('winner');

    var cx = React.addons.classSet;
    var winnerClasses = cx({
      'red': winner === 'red',
      'yellow': winner === 'yellow'
    });

    return (
      <header className="center px3 py4 white bg-navy bg-cover bg-center">
        <h1 className="h1 h0-responsive caps mt4 mb0 regular">Game over</h1>
        <p className="h3 caps">Wnner <span className={winnerClasses}>{winner}</span></p>
        <a href="#" className="h3 button button-big mb4" onClick={this.handleClick}>Start again</a>
      </header>
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
    Actions.activateCell(this.props.cell);
  },
  render: function(){

    var cx = React.addons.classSet;
    var classes = cx({
      'board-cell': true,
      'center': true,
      'bg-navy': this.props.cell.color === 'black',
      'bg-darken-1': this.props.cell.color === 'white'
    });

    var coords;
    // coords = this.props.cell.pos[0] + ',' + this.props.cell.pos[1];
    return (
      <td className={classes} onClick={this.handleClick} >
        {this.props.children}
        {coords}
      </td>
    );

  }
});

module.exports = Game;
