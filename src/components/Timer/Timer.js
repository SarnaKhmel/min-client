import React, { Component } from 'react';
import './Timer.css';

export default class Timer extends Component {

  state = {
    currentTime: 0,
    timerEnd: null,
    intervalNum: null

  }

  handleStartClick = () => {
    const timer = setInterval(() => {
      this.setState({
        currentTime: this.state.currentTime + 1
      })
    },
    1000);

    this.setState({
      intervalNum: timer
    })
  }

  handleStopClick = () => {
    clearInterval(this.state.intervalNum);
  }


  render() {
    return (
      <div className="timer">
        <div className="timer-counter">{this.state.currentTime}</div>
        <div className="timer-buttons">
            <div className="timer-button start" onClick={this.handleStartClick}>start</div>
            <div className="timer-button stop" onClick={this.handleStopClick}>stop</div>
        </div>    
      </div>
    )
  }
}
