import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import {PlayerColors} from './actions'

const { RED, YELLOW } = PlayerColors

export class Piece extends Component{

  render() {

    const {piece, currentPlayer, onClick, selected} = this.props

    var classes = classNames({
      'piece': true,
      'bg-red': piece.color === RED && !piece.pending,
      'bg-fuchsia': piece.color === RED && piece.pending,
      'piece-red--curent': piece.color === RED && currentPlayer === RED,
      'bg-yellow': piece.color === YELLOW && !piece.pending,
      'bg-green': piece.color === YELLOW && piece.pending,
      'piece-yellow--current': piece.color === YELLOW && currentPlayer === YELLOW,
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
      <td className={classes}  onClick={this.props.onClick} >
        {this.props.children}
        {coords}
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


