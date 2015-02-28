var React = require('react');

var Board = React.createClass({
  getInitialState: function() {
    return {
      pieces: []
    };
  },
  handlePieceClick: function(piece) {
    this.unSelectAllPieces();
    piece.selected = true;
    this.updatePiece(piece);
    // TODO: submit to the server and refresh the list
  },
  handleCellClick: function(pos) {

    var selectedPiece = this.getSelectedPiece();

    if(!selectedPiece){
      return;
    }

    selectedPiece.pos = pos;
    this.updatePiece(selectedPiece);

    this.unSelectAllPieces();

    // TODO: submit to the server and refresh the list
  },
  updatePiece: function(selectedPiece){

    var pieces = this.state.pieces;

    //TODO find better way of doing this
    pieces.forEach(function(piece, index){
      if(piece.pos === selectedPiece.pos){
        pieces[index] = piece;
      }
    });

    this.setState({pieces: pieces});
  },
  getSelectedPiece: function(){
    return this.props.pieces.filter(piece => piece.selected === true).shift();
  },
  unSelectAllPieces: function(){
    this.props.pieces.forEach( piece => piece.selected = false );
  },
  componentDidMount: function() {
    this.setState({pieces: this.props.pieces});
  },
  componentWillUnmount: function() {

  },
  render: function() {

    var cellCount = 10;

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

        var piece = this.state.pieces.filter(piece => piece.pos[0] === xPos && piece.pos[1] === yPos).shift();

        var pos = [xPos, yPos];

        if(piece){
          boardCells.push(<BoardCell color={color} pos={pos} onCellClick={this.handleCellClick} ><Piece onPieceClick={this.handlePieceClick} piece={piece}></Piece></BoardCell>);
        }else{
          boardCells.push(<BoardCell color={color} pos={pos} piece={piece} onCellClick={this.handleCellClick} />);
        }

        xPos++;

      }

      boardRows.push(<BoardRow>{boardCells}</BoardRow>);

      yPos++;

    }

    return (
      <table>
        {boardRows}
      </table>
    );

  }
});

var BoardRow = React.createClass({
  handleClick: function(evt) {
    this.props.onPieceClick(this);
  },
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
    this.props.onCellClick(this.props.pos);
  },
  render: function(){
    var cx = React.addons.classSet;
    var classes = cx({
      'board-cell': true,
      'board-cell-black': this.props.color === 'black',
      'board-cell-white': this.props.color === 'white'
    });
    return (
      <td className={classes} onClick={this.handleClick} >{this.props.children}</td>
    );
  }
});

var Piece = React.createClass({
  handleClick: function(evt) {
    evt.stopPropagation();
    this.props.onPieceClick(this.props.piece);
  },
  render: function(){
    var cx = React.addons.classSet;
    var classes = cx({
      'piece': true,
      'piece-red': this.props.piece.color === 'red',
      'piece-yellow': this.props.piece.color === 'yellow',
      'piece-selected': this.props.piece.selected
    });
    return <div className={classes} onClick={this.handleClick}></div>
  }
});


module.exports = {
  Board: Board
};
