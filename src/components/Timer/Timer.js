import React, { Component } from 'react';
import './Timer.css';

import calculateAndRenderTimer from '../../modules/timerScreen';

export default class Timer extends Component {

  state = {
    currentTime: 0,
    intervalNum: null,
    timerRunning: false,
    timerHours: "00",
    timerMinutes: "00",
    timerSeconds: "00"

  }

  // Calculates the number of seconds equivalent to what the user inputs for the timer's length
  calculateTimeIntegerFromInputLength = () => {
    let hoursToSeconds = parseInt(this.state.timerHours) * 3600;
    let minutesToSeconds = parseInt(this.state.timerMinutes) * 60;
    let seconds = parseInt(this.state.timerSeconds);

    if (this.state.timerHours === "") {
      hoursToSeconds = 0;
    }
    if (this.state.timerMinutes === "") {
      minutesToSeconds = 0;
    }
    if (this.state.timerSeconds === "") {
      seconds = 0;
    }
    return hoursToSeconds + minutesToSeconds + seconds;
  }

  // This method runs each time the timer interval is completed to either decrease state.currentTime by one and allow the timer to count down, or triggering the alarm if state.timerRunning is true and the timer has reached 0
  timerCallback = () => {
    if (this.state.currentTime === 0 && this.state.timerRunning === true) {
      const alarm = new Audio(require('./audio/chime.wav'));
      alarm.play();
      this.handleStopClick();
    }  else {
      this.setState({
        currentTime: this.state.currentTime - 1
      })
    }       
  }

  // Handles click event for start button by beginning a setInterval call and setting the interval number to state and setting state.timerRunning to true
  handleStartClick = () => {
    const timer = setInterval(this.timerCallback,
    1000);
    this.setState({
      intervalNum: timer,
      timerRunning: true
    })  
  }

  // Handles click event for stop button by clearing the timer interval and setting state.timerRunning to false
  handleStopClick = () => {
    clearInterval(this.state.intervalNum);
    this.setState({
      timerRunning: false
    })
  }

  // Handles click event for reset button by clearing the timer interval, setting the timer display and all inputs to zero and setting the state.timerRunning value to false to prevent the alarm from triggering
  handleResetClick = () => {

    clearInterval(this.state.intervalNum);

    this.setState({
      currentTime: 0,
      timerHours: "00",
      timerMinutes: "00",
      timerSeconds: "00",
      timerRunning: false
    })
  }

  // Callback for handleInputChange that sets state.currentTime to match the inputted timer length
  setCurrentTimeFromInput = () => {
    this.setState({
      currentTime: this.calculateTimeIntegerFromInputLength()
    })
  }

  // Sets the state for timer hours, minutes and seconds based on the user's input
  handleInputChange = function({target}) {
    this.setState({
      [target.name]: target.value
    }, this.setCurrentTimeFromInput)
  }.bind(this);


  render() {
    return (
      <div className="timer">
        <div className="timer-counter">{calculateAndRenderTimer(this.state.currentTime, this.state.intervalNum)}</div>
        <div className="timer-buttons-and-inputs">
          <div className="length-input-wrapper">
            <label className="length-input-label">
              hours:
              <input maxLength="2" className="length-input" type="text" value={this.state.timerHours} onChange={this.handleInputChange} name="timerHours" />
            </label>
            <label className="length-input-label">
              minutes:
              <input maxLength="2" className="length-input" type="text" value={this.state.timerMinutes} onChange={this.handleInputChange} name="timerMinutes" />
            </label>
            <label className="length-input-label">
              seconds:
              <input maxLength="2" className="length-input" type="text" value={this.state.timerSeconds} onChange={this.handleInputChange} name="timerSeconds" />
            </label>
          </div>
          <div className="timer-buttons">
              <div className="timer-button start" onClick={this.handleStartClick}>start</div>
              <div className="timer-button stop" onClick={this.handleStopClick}>stop</div>
              <div className="timer-button reset" onClick={this.handleResetClick}>reset</div>
          </div>
        </div>      
      </div>
    )
  }
}
