import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';

import Timer from './components/Timer/Timer';

class App extends Component {

  componentDidMount() {
    this.props.setTest("hello");
  }


  render() {
    console.log(this.props.test)
    return (
      <div className="App">
        <Timer />
        <Timer />
        <Timer />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    test: state.test
  }
}

export default connect(mapStateToProps, actions)(App);
