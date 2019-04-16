import React, { Component } from 'react';
import {connect} from 'react-redux';
import './Timer.css';
import * as actions from '../../../redux/actions';
import uuid from 'uuid';
import AlertDialog from '../AlertDialog/AlertDialog';

import calculateAndRenderTimer from '../../../modules/timerScreen';

class Timer extends Component {

  state = {
    name: "",
    id: null,
    pomLength: 0,
    currentTime: 0,
    breakLength: 0,
    breakTime: 0,
    longBreakLength: 0,
    longBreakTime: 0,
    longBreakMinutes: "00",
    intervalNum: null,
    timerRunning: false,
    timerHours: "00",
    timerMinutes: "00",
    timerSeconds: "00",
    isPomodoro: false,
    breakMinutes: "00",
    isBreak: false,
    isLongBreak: false,
    pomCount: 0,
    alertOpen: false,
    alertTitle: "",
    alertContent: ""
  }

  componentDidMount() {
    this.isPomodoro();
  }

  // Determines if the current timer instance is a pomodoro, and sets state.isPomodoro accordingly. This triggers the conditional rendering of either a timer component or a modified pomodoro timer component
  isPomodoro = () => {
    if (this.props.isPomodoro) {
      this.setState({
        isPomodoro: true,
        id: uuid()
      })
    } else {
      this.setState({
        isPomodoro: false,
        id: this.props.id
      })
    }
  };

  renderPomClassBasedOnIsBreak = () => {
    return this.state.isBreak ? "timer pom break" : "timer pom";
  };

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
  };

  // Calculates the number of seconds equivalent to an inputted amount of minutes
  calculateTimeIntegerFromMinuteInputOnly = (inputMinutes) => {
    if (!inputMinutes || inputMinutes === "") return 0;
    return parseInt(inputMinutes) * 60;
  };

  // Converts seconds to minutes for break alert message
  convertSecondsToMinutes = (input) => {
    return Math.round(input / 60);
  }

  // This method runs each time the timer interval is completed to either decrease state.currentTime by one and allow the timer to count down, or triggering the alarm if state.timerRunning is true and the timer has reached 0
  timerCallback = async () => {
    if(this.state.isPomodoro) {
      if (this.state.isBreak) {
        if (this.state.pomCount % 4 === 0) {
          await this.setState({
            isLongBreak: true
          });
          if (this.state.longBreakLength === this.state.longBreakTime) {
            this.setState({
              alertOpen: true,
              alertTitle: "long break time!",
              alertContent: `time for a ${this.convertSecondsToMinutes(this.state.longBreakLength)} minute break`
            });
          }
          if (this.state.longBreakTime === 0 && this.state.timerRunning === true) {
            const alarm = new Audio(require('./audio/chime.wav'));
            alarm.play();
            this.setState({
              isBreak: false,
              isLongBreak: false,
              currentTime: this.state.pomLength,
              alertOpen: true,
              alertTitle: "break's over!",
              alertContent: "time to get back to work"
            });
          }  else {
            this.setState({
              longBreakTime: this.state.longBreakTime - 1
            })
          }
        } else {
          if (this.state.breakTime === 0 && this.state.timerRunning === true) {
            const alarm = new Audio(require('./audio/chime.wav'));
            alarm.play();
            this.setState({
              isBreak: false,
              currentTime: this.state.pomLength,
              alertOpen: true,
              alertTitle: "break's over!",
              alertContent: "time to get back to work"
            });
          }  else {
            this.setState({
              breakTime: this.state.breakTime - 1
            })
          }
        }   
      }
      else {
        if (this.state.currentTime === 0 && this.state.timerRunning === true) {
          const alarm = new Audio(require('./audio/chime.wav'));
          alarm.play();
          this.setState({
            isBreak: true,
            breakTime: this.state.breakLength,
            longBreakTime: this.state.longBreakLength,
            pomCount: this.state.pomCount + 1,
            alertOpen: true,
            alertTitle: "short break time!",
            alertContent: `time for a ${this.convertSecondsToMinutes(this.state.breakLength)} minute break`
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
        this.setState({
          alertOpen: true,
          alertTitle: "time's up!",
          alertContent: `your ${this.state.name} timer has finished`
        })
        this.handleStopClick();
      }  else {
        this.setState({
          currentTime: this.state.currentTime - 1
        })
      }
    }       
  };

  // Validates the regular timer length input to ensure that it is greater than zero seconds, or validates all pomodoro inputs to ensure that each one is greater than zero seconds
  validateTimerInput = () => {

    const timer = document.getElementById(this.state.id);

    if (this.state.isPomodoro) {
      if (this.state.pomLength === 0 || this.state.breakLength === 0 || this.state.longBreakLength === 0) {
        timer.lastChild.style.display = "block";
        return false;
      } else {
        timer.lastChild.style.display = "none";
        return true;
      }
    } else {
      if (this.state.pomLength === 0 && this.state.breakLength === 0){
        timer.lastChild.style.display = "block";
        return false;
      } else {
        timer.lastChild.style.display = "none";
        return true;
      }
    }
  };

  // Handles click event for start button by beginning a setInterval call and setting the interval number to state and setting state.timerRunning to true
  handleStartClick = () => {
    const valid = this.validateTimerInput();
    if (!valid) return;
    const timer = setInterval(this.timerCallback, 1000);
    this.setState({
      intervalNum: timer,
      timerRunning: true
    })  
  };

  // Handles click event for stop button by clearing the timer interval and setting state.timerRunning to false
  handleStopClick = () => {
    clearInterval(this.state.intervalNum);
    this.setState({
      timerRunning: false
    })
  };

  // Handles click event for reset button by clearing the timer interval, setting the timer display and all inputs to zero and setting the state.timerRunning value to false to prevent the alarm from triggering
  handleResetClick = () => {
    const timer = document.getElementById(this.state.id);
    timer.lastChild.style.display = "none";

    clearInterval(this.state.intervalNum);

    this.setState({
      currentTime: 0,
      breakTime: 0,
      pomLength: 0,
      breakLength: 0,
      longBreakLength: 0, 
      timerHours: "00",
      timerMinutes: "00",
      timerSeconds: "00",
      breakMinutes: "00",
      longBreakMinutes: "00",
      timerRunning: false,
      isBreak: false,
      isLongBreak: false
    });
  };

  // Callback for handleInputChange that sets state.currentTime to match the inputted timer length
  setCurrentTimeFromInput = () => {
    const timerLength = this.calculateTimeIntegerFromInputLength();
    this.setState({
      currentTime: timerLength,
      pomLength: timerLength
    });
  };

  // Callback for handleInputChange that sets the given portion of state equal to the provided minutes value calculated in seconds format
  setStateFromMinuteInput = (statePortion) => {
    let time; 
    switch (statePortion) {
      case "currentTime":
        time = this.calculateTimeIntegerFromMinuteInputOnly(this.state.timerMinutes);
        this.setState({
          pomLength: time,
          currentTime: time
        });
        break;
      case "breakTime":
        time = this.calculateTimeIntegerFromMinuteInputOnly(this.state.breakMinutes);
        this.setState({
          breakLength: time,
          breakTime: time
        });
        break;
      case "longBreakTime":
        time = this.calculateTimeIntegerFromMinuteInputOnly(this.state.longBreakMinutes);
        this.setState({
          longBreakLength: time,
          longBreakTime: time
        });
        break;
      default:
        return;
    }
  };

  // Sets the state for timer hours, minutes and seconds based on the user's input
  handleInputChange = (callback, e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, callback)
  };

  // Conditionally renders the amount of seconds remaining on either the pom timer or break timer dependent on state.isBreak for the pomodoro timer
  conditionallyRenderCurrentTimeOrBreakTime = () => {
    if (this.state.isBreak && this.state.isLongBreak) {
      return calculateAndRenderTimer(this.state.longBreakTime, this.state.intervalNum);
    }
    else if (this.state.isBreak) {
      return calculateAndRenderTimer(this.state.breakTime, this.state.intervalNum);
    } else {
      return calculateAndRenderTimer(this.state.currentTime, this.state.intervalNum);
    }
  };

  // Gets timerId from parent div and removes the timer from the redux store
  handleRemoveTimer = ({target}) => {
    const timerId = target.parentElement.id;
    this.props.removeTimer(timerId);
  };
  
  // Hides the "timer name" label when user clicks on the timerName input field
  handleNameFocus = () => {
    const label = document.getElementById('label-' + this.state.id);
    label.style.display = "none";
  }

  // Shows the "timer name" label when user focus leaves the timerName input field, if state.name is blank
  handleNameUnfocus = () => {
    const label = document.getElementById('label-' + this.state.id);
    if (this.state.name === "") label.style.display = "block";
  }

  // Closes the timer alertDialog window
  handleAlertClose = () => {
    this.setState({ alertOpen: false });
  };

  // Conditionally renders a normal timer or pomodoro dependent on state.isPomodoro
  render() {
    if (this.state.isPomodoro) {
      return (
        <>
        <AlertDialog 
          open={this.state.alertOpen} 
          title={this.state.alertTitle} 
          content={this.state.alertContent} 
          handleAlertClose={this.handleAlertClose}
          isBreak={this.state.isBreak}
        />
        <div id={this.state.id} className={this.renderPomClassBasedOnIsBreak()}>
          <div className="timer-name-wrapper">
            <label className="timer-name-label" id={'label-' + this.state.id} htmlFor={"timer-" + this.state.id}>
              timer name
            </label>
            <input 
              name="name" 
              className="timer-name" 
              type="text" id={"timer-" + this.state.id} 
              value={this.state.name} 
              maxLength="15"
              onChange={this.handleInputChange.bind(this, null)} 
              onFocus={this.handleNameFocus}
              onBlur={this.handleNameUnfocus}
            />
          </div>
          <div className="timer-counter">{this.conditionallyRenderCurrentTimeOrBreakTime()}</div>
          <div className="pom-input-container">
            <div className="pom-inputs">
              <h3>timer</h3>
              <div className="length-input-wrapper">
                <label className="length-input-label">
                  minutes:
                  <input maxLength="2" className="length-input" type="text" value={this.state.timerMinutes} onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("currentTime"))} name="timerMinutes" />
                </label>
              </div>
            </div>
            <div className="break-inputs">
              <h3>short break</h3>
              <div className="length-input-wrapper">
                <label className="length-input-label">
                  minutes:
                  <input maxLength="2" className="length-input" type="text" value={this.state.breakMinutes} onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("breakTime"))} name="breakMinutes" />
                </label>
              </div>
            </div> 
            <div className="break-inputs">
              <h3>long break</h3>
              <div className="length-input-wrapper">
                <label className="length-input-label">
                  minutes:
                  <input maxLength="2" className="length-input" type="text" value={this.state.longBreakMinutes} onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("longBreakTime"))} name="longBreakMinutes" />
                </label>
              </div>
            </div> 
          </div> 
          <div className="timer-buttons">
                  <div className="timer-button start" onClick={this.handleStartClick}>start</div>
                  <div className="timer-button stop" onClick={this.handleStopClick}>stop</div>
                  <div className="timer-button reset" onClick={this.handleResetClick}>reset</div>
          </div>  
          <div className="invalid-timer-input">please enter a length greater than zero for timer and breaks</div>   
        </div>
      </>
      )
    } else {
      return (
        <>
        <AlertDialog 
          id="alert-window" 
          open={this.state.alertOpen} 
          title={this.state.alertTitle} 
          content={this.state.alertContent} 
          handleAlertClose={this.handleAlertClose}
          isBreak={true}
        />
        <div id={this.state.id} className="timer">
          <i 
            id="remove-timer-button" 
            className="fas fa-times" 
            onClick={this.handleRemoveTimer}
          />
          <div className="timer-name-wrapper">
            <label className="timer-name-label" id={'label-' + this.state.id} htmlFor={"timer-" + this.state.id}>
              timer name
            </label>
            <input 
              name="name" 
              className="timer-name" 
              type="text" id={"timer-" + this.state.id} 
              value={this.state.name} 
              maxLength="15"
              onChange={this.handleInputChange.bind(this, null)} 
              onFocus={this.handleNameFocus}
              onBlur={this.handleNameUnfocus}
            />
          </div>
          <div className="timer-counter">{calculateAndRenderTimer(this.state.currentTime, this.state.intervalNum)}</div>
          <div className="timer-buttons-and-inputs">
            <div className="length-input-wrapper">
              <label className="length-input-label">
                hours:
                <input maxLength="2" className="length-input" type="text" value={this.state.timerHours} onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} name="timerHours" />
              </label>
              <label className="length-input-label">
                minutes:
                <input maxLength="2" className="length-input" type="text" value={this.state.timerMinutes} onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} name="timerMinutes" />
              </label>
              <label className="length-input-label">
                seconds:
                <input maxLength="2" className="length-input" type="text" value={this.state.timerSeconds} onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} name="timerSeconds" />
              </label>
            </div>
            <div className="timer-buttons">
                <div className="timer-button start" onClick={this.handleStartClick}>start</div>
                <div className="timer-button stop" onClick={this.handleStopClick}>stop</div>
                <div className="timer-button reset" onClick={this.handleResetClick}>reset</div>
            </div>
          </div>  
          <div className="invalid-timer-input">please enter a timer length greater than zero seconds</div>    
        </div>
        </>
      );
    } 
  };
};

export default connect(null, actions)(Timer);
