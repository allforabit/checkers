
var findPieceBindingById = function(piecesBinding, id){
  var pieceIndex = piecesBinding.get().findIndex(function(piece) {
    return piece.get('id') === id
  });
  return piecesBinding.sub(pieceIndex);
}

module.exports = {
  findPieceBindingById: findPieceBindingById
}
