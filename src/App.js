import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import {BoardCell, BoardRow, Piece} from './components'
import {VisibilityFilters, selectPiece, clickCell} from './actions'

class App extends Component{
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

    const { currentPlayer, dispatch, canCompleteTurn, game, me } = this.props
    const {selectedPieceIndex, pieces} = game

    var cellCount = 8

    var boardRows = []

    var color = 'white'

    let xPos = 0
    let yPos = 0

    for (var i = 0; i < cellCount; i++) {

      xPos = 0;

      var boardCells = [];

      // TODO dry up
      if(color === 'white'){
        color = 'black'
      }else{
        color = 'white'
      }

      for (var j = 0; j < cellCount; j++) {

        if(color === 'white'){
          color = 'black'
        }else{
          color = 'white'
        }

        let pos = [xPos, yPos];

        let cell = {
          color: color,
          pos: pos
        }

        let pieceIndex = pieces.findIndex(p => p.pos[0] === xPos
          && p.pos[1] === yPos
          && p.captured !== true);

        let piece = pieces[pieceIndex]

        let key = xPos + ':' + yPos

        let isCurrentPieceSelected = pieceIndex === selectedPieceIndex;

        if(piece){
          boardCells.push(<BoardCell key={key} cell={cell} ><Piece key={key} piece={piece} selected={isCurrentPieceSelected} currentPlayer={currentPlayer} onClick={() => dispatch(selectPiece(pieceIndex))} ></Piece></BoardCell>);
        }else{
          boardCells.push(<BoardCell key={key} onClick={() => dispatch(clickCell(pos)) } cell={cell} />);
        }

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

    var style = {};

    style.maxWidth = '70%'

    // if(pending){
    //   style.opacity = '0.4';
    // }

    return (
      <div style={style} >
        <button className="button mb1 bg-gray" onClick={this.handleNewGame}>New game</button>
        <table>
          <tbody>
          {boardRows}
          </tbody>
        </table>
        <div>
          <h3>Captured enemy pieces</h3>
          <h3>Current player: {currentPlayer}</h3>
        </div>

      </div>
    );

  }
}

App.propTypes = {
  currentPlayer: PropTypes.oneOf([
    'RED',
    'YELLOW'
  ])
}

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    currentPlayer: state.currentPlayerColor,
    game: state.game
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
