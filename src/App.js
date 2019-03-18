import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';

import Timer from './components/Timer/Timer';



class App extends Component {
  render() {
    return (
      <div className="App">
        <div><h1>min</h1></div>
        <div className="timers-container">
          <Timer />
          <Timer />
          <Timer />
        </div>   
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    test: state.test
  }
};

export default connect(mapStateToProps, actions)(App);
