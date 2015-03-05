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
    var classes = cx({
      'piece': true,
      'piece-red': piece.get('color') === 'red',
      'piece-red--curent': piece.get('color') === 'red' && this.props.currentPlayer === 'red',
      'piece-yellow': piece.get('color') === 'yellow',
      'piece-yellow--current': piece.get('color') === 'yellow' && this.props.currentPlayer === 'yellow',
      'piece-selected': piece.get('selected')
    });

    return (
      <a className={classes} onClick={this.handleClick} href="#"></a>
    );
  }
});
