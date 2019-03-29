import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';
import uuid from 'uuid';

import Timer from './components/Timer/Timer';
import NavBar from './components/NavBar/NavBar';



class App extends Component {

  handleAddTimer = () => {
    this.props.addTimer({
      id: uuid(), 
      name: "test",  
      currentTime: 0, 
      intervalNum: null,
      timerRunning: false,
      timerHours: "00",
      timerMinutes: "00",
      timerSeconds: "00"
    });
  }

  renderTimersFromReduxStore = () => {
    return this.props.timers.map(timer => <Timer  data={timer} key={uuid()} />);
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="add-timer-button" onClick={this.handleAddTimer}>add a timer</div>
        <div className="timers-container">
          <Timer isPomodoro="true" />
          {this.renderTimersFromReduxStore()}
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
