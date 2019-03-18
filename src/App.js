import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';

import Timer from './components/Timer/Timer';



class App extends Component {

  handleAddTimer = () => {
    this.props.addTimer({name: "test", currentTime: 200, timerRunning: false});
  }

  render() {
    console.log(this.props.timers);
    return (
      <div className="App">
        <div><h1>min</h1></div>
        <div onClick={this.handleAddTimer}>add a timer</div>
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
    timers: state.timers.timers
  }
};

export default connect(mapStateToProps, actions)(App);
