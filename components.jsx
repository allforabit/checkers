var React = require('react/addons');
var Morearty = require('morearty');

var Board = React.createClass({
  mixins: [Morearty.Mixin],
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
  handleCellClick: function(cell) {

    if(cell.color === 'white'){
      return;
    }

    var selectedPiece = this.getSelectedPiece();

    if(!selectedPiece){
      return;
    }

    //check x coords
    if(Math.abs(selectedPiece.pos[0] - cell.pos[0]) !== 1){
      return;
    }

    //check y choords for yellow player
    if(selectedPiece.color === 'yellow'){
      if(selectedPiece.pos[1] - cell.pos[1] !== 1){
        return;
      }
    }

    //check y choords for red player
    if(selectedPiece.color === 'red'){
      if(selectedPiece.pos[1] - cell.pos[1] !== -1){
        return;
      }
    }

    selectedPiece.pos = cell.pos;
    this.updatePiece(selectedPiece);

    this.unSelectAllPieces();

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

    var binding = this.getDefaultBinding();

    var piecesBinding = binding.sub('pieces');
    var pieces = piecesBinding.get();

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

        // var piece = pieces.filter(piece => ).shift();

        var pos = [xPos, yPos];
        var cell = {
          pos: pos,
          color: color
        }

        var piece = pieces
          .filter(p => p.getIn(['pos', 0]) === xPos && p.getIn(['pos', 1]) === yPos)
          .take(1);

        console.log(piece);

        var key = xPos + yPos;

        if(piece){
          boardCells.push(<BoardCell key={key} cell={cell} onCellClick={this.handleCellClick} ><Piece key={key} onPieceClick={this.handlePieceClick} piece={piece}></Piece></BoardCell>);
        }else{
          boardCells.push(<BoardCell key={key} cell={cell} onCellClick={this.handleCellClick} />);
        }

        xPos++;

      }

      boardRows.push(<BoardRow key={yPos}>{boardCells}</BoardRow>);

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
    this.props.onCellClick(this.props.cell);
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

var Piece = React.createClass({
  handleClick: function(evt) {
    evt.stopPropagation();
    this.props.onPieceClick(this.props.piece);
  },
  render: function(){
    var binding = this.getDefaultBinding();
    var piece = binding.get();
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
