import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as CounterActions from './actions';
import {Board} from './components';


function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

class Game extends Component {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter, select } = this.props;
    return (
      <Board />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
