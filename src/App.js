import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import {BoardCell, BoardRow, Piece, GameOver} from './components'

import {
  PlayerColors,
  VisibilityFilters,
  selectPiece,
  clickCell,
  resetGame,
  completeTurn
} from './actions'

const {RED, YELLOW} = PlayerColors

class App extends Component{
  componentDidMount () {
    $(document.body).on('keydown', this.handleKeyDown.bind(this))
  }

  componentWillUnmount () {
    $(document.body).off('keydown', this.handleKeyDown.bind(this))
  }

  handleKeyDown(e) {

    const SPACEBAR = 13
    const ENTER = 32

    const {dispatch} = this.props

    if( e.keyCode === ENTER || e.keyCode === SPACEBAR) {
      e.preventDefault()
      dispatch(completeTurn())
    }

  }

  render() {

    const { currentPlayer, dispatch, game, me } = this.props
    const { selectedPieceIndex, pieces, gameOver, winner, canCompleteTurn} = game

    if(gameOver){
      return (
        <GameOver winner={winner} onClick={() => dispatch(resetGame())}></GameOver>
      )
    }

    let cellCount = 8

    let boardRows = []

    let color = 'white'

    let xPos = 0
    let yPos = 0

    for (let i = 0; i < cellCount; i++) {

      xPos = 0;

      let boardCells = [];

      // TODO dry up
      if(color === 'white'){
        color = 'black'
      }else{
        color = 'white'
      }

      for (let j = 0; j < cellCount; j++) {

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

        let pieceIndex = pieces.findIndex(p => p.pos && p.pos[0] === xPos
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

    let completeTurnBtn

    if (canCompleteTurn) {
      completeTurnBtn = <button className="button mb1 bg-fuchsia" onClick={ () => dispatch(completeTurn()) }>Complete turn</button>;
    }

    var redCapturedEnemyPiecesCount = pieces
      .filter(piece => piece.color === YELLOW && piece.captured === true )
      .length

    var yellowCapturedEnemyPiecesCount = pieces
      .filter(piece => piece.color === RED && piece.captured === true )
      .length

    var style = {};

    style.maxWidth = '70%'

    return (
      <div style={style} >
        <button className="button mb1 bg-gray" onClick={ () => dispatch(resetGame()) }>New game</button>
        <table>
          <tbody>
          {boardRows}
          </tbody>
        </table>
        <div> I am - {me.color}</div>
        <div> Turn - {currentPlayer}</div>
        {completeTurnBtn}
        <div>
          <h3>Captured enemy pieces</h3>
          <div> Red - {redCapturedEnemyPiecesCount}</div>
          <div> Yellow - {yellowCapturedEnemyPiecesCount}</div>
        </div>
      </div>
    )

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
    game: state.game,
    me: state.me
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
