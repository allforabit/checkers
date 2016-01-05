import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import {PlayerColors} from './constants'

const { RED, YELLOW } = PlayerColors

export class Piece extends Component{

  render() {

    const {piece, currentPlayerColor, onClick, selected} = this.props

    var classes = classNames({
      'piece': true,
      'bg-red': piece.color === RED && !piece.pending,
      'bg-fuchsia': piece.color === RED && piece.pending,
      'piece-red--curent': piece.color === RED && currentPlayerColor === RED,
      'bg-yellow': piece.color === YELLOW && !piece.pending,
      'bg-green': piece.color === YELLOW && piece.pending,
      'piece-yellow--current': piece.color === YELLOW && currentPlayerColor === YELLOW,
      'piece-selected': selected
    });

    var king = piece.king ? 'K' : ''

    return (
      <a className={classes} onClick={this.props.onClick} href="#">{king}</a>
    )
  }
}

export class BoardCell extends Component {

  render() {

    var classes = 'board-cell center';

    if(this.props.cell.color === 'black'){
      classes += ' bg-navy aqua';
    }

    if(this.props.cell.color === 'white'){
      classes += ' bg-aqua navy';
    }

    return (
      <td className={classes}  onClick={this.props.onClick} >
        {this.props.children}
      </td>
    )

  }

}

export class BoardRow extends Component {
  render() {
    return (
      <tr className="board-row">
        {this.props.children}
      </tr>
    );
  }
}

export class GameOver extends Component {
  render(){

    let {winner} = this.props

    var winnerClasses = classNames({
      'red': winner === RED,
      'yellow': winner === YELLOW
    })

    return (
      <header className="center px3 py4 white bg-navy bg-cover bg-center">
        <h1 className="h1 h0-responsive caps mt4 mb0 regular">Game over</h1>
        <p className="h3 caps">Wnner <span className={winnerClasses}>{winner}</span></p>
        <a href="#" className="h3 button button-big mb4" onClick={this.props.onClick}>Start again</a>
      </header>
    )

  }

}
