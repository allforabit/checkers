import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

class Piece extends Component{
  render() {

    const { select } = this.props;

    // var cx = React.addons.classSet;
    // var pending = piece.get('pending');

    // var classes = cx({
    //   'piece': true,
    //   'bg-red': piece.get('color') === 'red' && !pending,
    //   'bg-fuchsia': piece.get('color') === 'red' && pending,
    //   // 'piece-red--curent': piece.get('color') === 'red' && this.props.currentPlayer === 'red',
    //   'bg-yellow': piece.get('color') === 'yellow' && !pending,
    //   'bg-green': piece.get('color') === 'yellow' && pending,
    //   // 'piece-yellow--current': piece.get('color') === 'yellow' && this.props.currentPlayer === 'yellow',
    //   'piece-selected': piece.get('selected')
    // });

    // var king = piece.get('king') ? 'K' : '';

    return (
      <a onClick={select} href='#'> Hello yoho </a>
    );
  }
}

Piece.propTypes = {
  select: PropTypes.func.isRequired
};

class BoardCell extends Component {

  handleClick () {
    // Actions.activateCell(this.props.cell);
  }

  render() {

    // var cx = React.addons.classSet;
    // var classes = cx({
    //   'board-cell': true,
    //   'center': true,
    //   'bg-navy': this.props.cell.color === 'black',
    //   'bg-darken-1': this.props.cell.color === 'white'
    // });

    var classes = 'board-cell center';

    if(this.props.cell.color === 'black'){
      classes += ' bg-navy aqua';
    }
    if(this.props.cell.color === 'white'){
      classes += ' bg-aqua red';
    }

    var coords = this.props.cell.pos[0] + ',' + this.props.cell.pos[1];
    return (
      <td className={classes} onClick={this.handleClick} >
        {this.props.children}
        {coords}
      </td>
    );

  }
}

class BoardRow extends Component {
  render() {
    return (
      <tr className="board-row">
        {this.props.children}
      </tr>
    );
  }
}


export class Board extends Component{
  componentDidMount () {
    $(document.body).on('keydown', this.handleKeyDown);
  }

  componentWillUnmount () {
    $(document.body).off('keydown', this.handleKeyDown);
  }
  handleCompleteTurn (){
    // Actions.attemptCompleteTurn();
  }

  handleNewGame (){
    // Actions.newGame();
  }

  handleKeyDown(e) {

    var SPACEBAR = 13;
    var ENTER = 32;

    if( e.keyCode === ENTER || e.keyCode === SPACEBAR) {
      e.preventDefault();
      // Actions.completeTurn();
    }

  }

  render() {

    
    const { currentPlayer } = this.props;

    // var binding = this.getDefaultBinding();
    // var currentPlayer = binding.get('currentPlayer');
    // var canCompleteTurn = binding.get('canCompleteTurn');
    // var pending = binding.get('pending');

    // var piecesBinding = binding.sub('pieces');
    // var pieces = piecesBinding.get();

    // var me = binding.get('me');

    var cellCount = 8;

    var boardRows = [];

    var color = 'white';

    var xPos = 0;
    var yPos = 0;

    for (var i = 0; i < cellCount; i++) {
      xPos = 0;

      var boardCells = [];

      //TODO dry up
      if(color === 'white'){
        color = 'black';
      }else{
        color = 'white';
      }

      for (var j = 0; j < cellCount; j++) {

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

        // var piece = pieces
        //   .filter(p => p.getIn(['pos', 0]) === xPos
        //       && p.getIn(['pos', 1]) === yPos
        //       && p.get('captured') !== true)
        //   .first();

        // var pieceIndex = piecesBinding.get().findIndex(function(p) {
        //   return p.getIn(['pos', 0]) === xPos
        //     && p.get('captured') !== true
        //     && p.getIn(['pos', 1]) === yPos;
        // });

        var key = xPos + yPos;

        // if(pieceIndex >= 0){
        //   var binding = piecesBinding.sub(pieceIndex);
        //   boardCells.push(<BoardCell key={key} cell={cell} ><Piece key={key}></Piece></BoardCell>);
        // }else{
        //   boardCells.push(<BoardCell key={key} cell={cell} />);
        // }
        boardCells.push(<BoardCell key={key} cell={cell} />);

        xPos++;

      }

      boardRows.push(<BoardRow key={yPos}>{boardCells}</BoardRow>);

      yPos++;

    }

    // if (canCompleteTurn) {
    //   console.log('canCompleteTurn');
    //   var completeTurn = <button className="button mb1 bg-fuchsia" onClick={this.handleCompleteTurn}>Complete turn</button>;
    // }

    // var redCapturedEnemyPiecesCount = pieces
    //   .filter(piece => piece.get('color') === 'yellow' && piece.get('captured') === true )
    //   .count();

    // var yellowCapturedEnemyPiecesCount = pieces
    //   .filter(piece => piece.get('color') === 'red' && piece.get('captured') === true )
    //   .count();

    // var completeTurn = <button onClick={this.handleCompleteTurn}>Complete turn</button>;

    var style;

    // if(pending){
    //   style = {opacity: '0.4'};
    // }

    return (
      <div style={style}>
        <button className="button mb1 bg-gray" onClick={this.handleNewGame}>New game</button>
        <table>
          {boardRows}
        </table>
        <div>
          <h3>Captured enemy pieces</h3>
        </div>

      </div>
    );

  }
}


// Game.propTypes = {
//   increment: PropTypes.func.isRequired,
//   incrementIfOdd: PropTypes.func.isRequired,
//   incrementAsync: PropTypes.func.isRequired,
//   decrement: PropTypes.func.isRequired,
//   counter: PropTypes.number.isRequired
// };
