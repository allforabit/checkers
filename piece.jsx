var Morearty = require('morearty');
var Actions = require('./actions');

module.exports = React.createClass({
  mixins: [Morearty.Mixin],
  handleClick: function(evt) {
    evt.stopPropagation();
    var id = this.getDefaultBinding().get('id');
    Actions.select(id);
  },

  render: function(){

    var binding = this.getDefaultBinding();
    var piece = binding.get();

    var cx = React.addons.classSet;
    var pending = piece.get('pending');

    var classes = cx({
      'piece': true,
      'bg-red': piece.get('color') === 'red' && !pending,
      'bg-fuchsia': piece.get('color') === 'red' && pending,
      // 'piece-red--curent': piece.get('color') === 'red' && this.props.currentPlayer === 'red',
      'bg-yellow': piece.get('color') === 'yellow' && !pending,
      'bg-green': piece.get('color') === 'yellow' && pending,
      // 'piece-yellow--current': piece.get('color') === 'yellow' && this.props.currentPlayer === 'yellow',
      'piece-selected': piece.get('selected')
    });

    var king = piece.get('king') ? 'K' : '';

    return (
      <a className={classes} onClick={this.handleClick} href="#">{king}</a>
    );
  }
});
