import React, { Component } from 'react';
import './Timer.css';
import uuid from 'uuid';

import calculateAndRenderTimer from '../../modules/timerScreen';

export default class Timer extends Component {

  state = {
    currentTime: 0,
    breakTime: 0,
    intervalNum: null,
    timerRunning: false,
    timerHours: "00",
    timerMinutes: "00",
    timerSeconds: "00",
    isPomodoro: false,
    breakMinutes: "00",
    isBreak: false
  }

  componentDidMount() {
    this.isPomodoro();
  }

  // Determines if the current timer instance is a pomodoro, and sets state.isPomodoro accordingly. This triggers the conditional rendering of either a timer component or a modified pomodoro timer component
  isPomodoro = () => {
    if (this.props.isPomodoro) {
      this.setState({
        isPomodoro: true
      })
    } else {
      this.setState({
        isPomodoro: false
      })
    }
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

  // Calculates the number of seconds equivalent to an inputted amount of minutes
  calculateTimeIntegerFromMinuteInputOnly = (inputMinutes) => {
    if (!inputMinutes || inputMinutes === "") return 0;
    return parseInt(inputMinutes) * 60;
  }

  // This method runs each time the timer interval is completed to either decrease state.currentTime by one and allow the timer to count down, or triggering the alarm if state.timerRunning is true and the timer has reached 0
  timerCallback = () => {
    if(this.state.isPomodoro) {
      if (this.state.isBreak) {
        if (this.state.breakTime === 0 && this.state.timerRunning === true) {
          const alarm = new Audio(require('./audio/chime.wav'));
          alarm.play();
          this.setState({
            isBreak: false
          });
        }  else {
          this.setState({
            breakTime: this.state.breakTime - 1
          })
        }
      }
      else {
        if (this.state.currentTime === 0 && this.state.timerRunning === true) {
          const alarm = new Audio(require('./audio/chime.wav'));
          alarm.play();
          this.setState({
            isBreak: true
          });
        }  else {
          this.setState({
            currentTime: this.state.currentTime - 1
          })
        }
      }
    } else {
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
          
  }

  // Handles click event for start button by beginning a setInterval call and setting the interval number to state and setting state.timerRunning to true
  handleStartClick = () => {
    const timer = setInterval(this.timerCallback, 100);
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

  // Callback for handleInputChange that sets the given portion of state equal to the provided minutes value calculated in seconds format
  setStateFromMinuteInput = (statePortion) => {
    let minutesValue;
    if (statePortion === "currentTime") minutesValue = this.state.timerMinutes;
    else if (statePortion === "breakTime") minutesValue = this.state.breakMinutes;
    const time = this.calculateTimeIntegerFromMinuteInputOnly(minutesValue);
    this.setState({
    [statePortion]: time
    });
  }

  // Sets the state for timer hours, minutes and seconds based on the user's input
  handleInputChange = (callback, e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, callback)
  }

  // Conditionally renders a normal timer or pomodoro dependent on state.isPomodoro
  render() {
    console.log(this.state.breakTime);
    if (this.state.isPomodoro) {
      return (
        <div className="timer pom">
          <div className="timer-counter">{calculateAndRenderTimer(this.state.currentTime, this.state.intervalNum)}</div>
          <div className="pom-input-container">
            <div className="pom-inputs">
              <h3>pom</h3>
              <div className="length-input-wrapper">
                <label className="length-input-label">
                  minutes:
                  <input maxLength="2" className="length-input" type="text" value={this.state.timerMinutes} onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("currentTime"))} name="timerMinutes" />
                </label>
              </div>
            </div>
            <div className="break-inputs">
              <h3>break</h3>
              <div className="length-input-wrapper">
                <label className="length-input-label">
                  minutes:
                  <input maxLength="2" className="length-input" type="text" value={this.state.breakMinutes} onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("breakTime"))} name="breakMinutes" />
                </label>
              </div>
            </div> 
          </div> 
          <div className="timer-buttons">
                  <div className="timer-button start" onClick={this.handleStartClick}>start</div>
                  <div className="timer-button stop" onClick={this.handleStopClick}>stop</div>
                  <div className="timer-button reset" onClick={this.handleResetClick}>reset</div>
              </div>   
        </div>
      )
    } else {
      return (
        <div id={uuid()} className="timer">
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
}
