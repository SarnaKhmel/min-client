import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';

import TestButton from './components/TestButton/TestButton';
import WithTest from './components/HOC/WithTest';
import Timer from './components/Timer/Timer';



class App extends Component {

  TimerWithTest = WithTest(Timer);

  render() {
    return (
      <div className="App">
        <div><h1>min</h1></div>
        <TestButton />
        <div className="timers-container">
          <Timer />
          <this.TimerWithTest />
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
}

export default connect(mapStateToProps, actions)(App);
