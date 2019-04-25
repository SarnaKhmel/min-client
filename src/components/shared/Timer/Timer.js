import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Timer.css';
import * as actions from '../../../redux/actions';
import AlertDialog from '../AlertDialog/AlertDialog';
import {putTimer, deleteTimer} from '../../../services/timers';

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
    longBreakMinutes: "",
    intervalNum: null,
    timerRunning: false,
    timerHours: "",
    timerMinutes: "",
    timerSeconds: "",
    isPomodoro: false,
    breakMinutes: "",
    isBreak: false,
    isLongBreak: false,
    pomCount: 0,
    alertOpen: false,
    alertTitle: "",
    alertContent: ""
  }

  async componentDidMount() {
    await this.handleTimerLoad();
    console.log(this.state);
  }

  async componentDidUpdate() {
    await putTimer(this.props.data._id, this.filterStateForTimerPost());
  }

  // Removes unnecessary keys from state to prepare the timer object for POST to DB
  filterStateForTimerPost = () => {
    const rawStateCopy = Object.assign({}, this.state);

    const notAllowed = ['alertOpen', 'alertTitle', 'alertContent'];

    const filtered = Object.keys(rawStateCopy)
              .filter(key => !notAllowed.includes(key))
              .reduce((obj, key) => {
                obj[key] = rawStateCopy[key];
                return obj;
              }, {});
    
    filtered.userId = this.props.userId;

    return filtered;
  };

  // Loads the timer by setting all props.data values to state
  handleTimerLoad = async () => {
    const timerProps = this.props.data;

    const timerObj = {
      name: timerProps.name,
      id: timerProps._id,
      pomLength: timerProps.pomLength || 0,
      currentTime: timerProps.currentTime || 0,
      breakLength: timerProps.breakLength || 0,
      breakTime: timerProps.breakTime || 0,
      longBreakLength: timerProps.longBreakLength || 0,
      longBreakTime: timerProps.longBreakTime || 0,
      longBreakMinutes: timerProps.longBreakMinutes || "",
      intervalNum: timerProps.intervalNum || null,
      timerRunning: timerProps.timerRunning || false,
      timerHours: timerProps.timerHours || "",
      timerMinutes: timerProps.timerMinutes || "",
      timerSeconds: timerProps.timerSeconds || "",
      isPomodoro: timerProps.isPomodoro || false,
      breakMinutes: timerProps.breakMinutes || "",
      isBreak: timerProps.isBreak || false,
      isLongBreak: timerProps.isLongBreak || false,
      pomCount: timerProps.pomCount || 0
    }

    await this.setState(timerObj);
    this.hidePlaceholders();
    this.setPomLengthFromInput();
  };

  // Hides all placeholders who's values in state are not empty
  hidePlaceholders = () => {
    const hoursPlaceholder = document.getElementById("timer-hours-placeholder-" + this.state.id);
    const minutesPlaceholder = document.getElementById("timer-minutes-placeholder-" + this.state.id);
    const secondsPlaceholder = document.getElementById("timer-seconds-placeholder-" + this.state.id);
    const breakMinutesPlaceholder = document.getElementById("break-minutes-placeholder-" + this.state.id);
    const longBreakMinutesPlaceholder = document.getElementById("longBreak-minutes-placeholder-" + this.state.id);
    if (hoursPlaceholder && this.state.timerHours) hoursPlaceholder.style.display = "none";
    if (minutesPlaceholder && this.state.timerMinutes) minutesPlaceholder.style.display = "none";
    if (secondsPlaceholder && this.state.timerSeconds) secondsPlaceholder.style.display = "none";
    if (breakMinutesPlaceholder && this.state.breakMinutes) breakMinutesPlaceholder.style.display = "none";
    if (longBreakMinutesPlaceholder && this.state.longBreakMinutes) longBreakMinutesPlaceholder.style.display = "none";
  };

  // Renders the Pomodoro timer's class conditionally based on state.isBreak, thus changing the appearance of the timer
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

    const timer = document.getElementById(this.props.data._id);

    if (this.state.isPomodoro) {
      if (this.state.pomLength === 0 || this.state.breakLength === 0 || this.state.longBreakLength === 0) {
        timer.lastChild.style.display = "block";
        return false;
      } else {
        timer.lastChild.style.display = "none";
        return true;
      }
    } else {
      if (this.state.pomLength === 0){
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

  // Switches all placeholder displays to visible, to be used in handleResetClick
  resetAllPlaceholders = () => {
    const hoursPlaceholder = document.getElementById("timer-hours-placeholder-" + this.state.id);
    const minutesPlaceholder = document.getElementById("timer-minutes-placeholder-" + this.state.id);
    const secondsPlaceholder = document.getElementById("timer-seconds-placeholder-" + this.state.id);
    const breakMinutesPlaceholder = document.getElementById("break-minutes-placeholder-" + this.state.id);
    const longBreakMinutesPlaceholder = document.getElementById("longBreak-minutes-placeholder-" + this.state.id);
    if (hoursPlaceholder) hoursPlaceholder.style.display = "block";
    if (minutesPlaceholder) minutesPlaceholder.style.display = "block";
    if (secondsPlaceholder) secondsPlaceholder.style.display = "block";
    if (breakMinutesPlaceholder) breakMinutesPlaceholder.style.display = "block";
    if (longBreakMinutesPlaceholder) longBreakMinutesPlaceholder.style.display = "block";
  };

  // Handles click event for reset button by clearing the timer interval, setting the timer display and all inputs to zero and setting the state.timerRunning value to false to prevent the alarm from triggering
  handleResetClick = async () => {
    const timer = document.getElementById(this.state.id);
    timer.lastChild.style.display = "none";

    clearInterval(this.state.intervalNum);

    await this.setState({
      currentTime: 0,
      breakTime: 0,
      pomLength: 0,
      breakLength: 0,
      longBreakLength: 0, 
      timerHours: "",
      timerMinutes: "",
      timerSeconds: "",
      breakMinutes: "",
      longBreakMinutes: "",
      timerRunning: false,
      isBreak: false,
      isLongBreak: false
    });

    this.resetAllPlaceholders();
    
  };

  // Callback for handleInputChange that sets state.currentTime to match the inputted timer length
  setCurrentTimeFromInput = () => {
    const timerLength = this.calculateTimeIntegerFromInputLength();
    this.setState({
      currentTime: timerLength,
      pomLength: timerLength
    });
  };

  // Sets pom length from the input values loaded from DB
  setPomLengthFromInput = () => {
    const timerLength = this.calculateTimeIntegerFromInputLength();
    this.setState({
      pomLength: timerLength
    });
  }

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

  // Gets the placeholder div by using the reformatted target div's id to find it
  findPlaceholderFromInput = (target) => {
    const idArray = target.id.split("-");
    const placeholderIdPrefix = idArray.slice(0, 2).join('-');
    const placeholderIdNum = idArray.slice(3).join("-");
    const placeholderId = placeholderIdPrefix + "-placeholder-" + placeholderIdNum;
    return document.getElementById(placeholderId);
  };

  // Reformats the first two words of the div's id to be in the proper format for a field in state
  getStateFieldNameFromId = (id) => {
    const fieldNameArray = id.split("-").slice(0, 2);
    const fieldNameWordTwoArray = fieldNameArray[1].split("");
    fieldNameWordTwoArray[0] = fieldNameWordTwoArray[0].toUpperCase();
    fieldNameArray[1] = fieldNameWordTwoArray.join("");
    return fieldNameArray.join("");
  }

  // Hides the timer input placeholder div on focus
  handleInputFocus = ({target}) => {
    const placeholder = this.findPlaceholderFromInput(target);
    placeholder.style.display = "none";
  };

  // Conditionally hides or shows the input placeholder div on blur dependent on the value of state[fieldName]
  handleInputBlur = ({target}) => {
    const fieldName = this.getStateFieldNameFromId(target.id);
    const placeholder = this.findPlaceholderFromInput(target);
    if (this.state[fieldName] === "") placeholder.style.display = "block";
    else placeholder.style.display = "none";
  }

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
  handleRemoveTimer = async ({target}) => {
    const timerId = target.parentElement.id;
    await deleteTimer(timerId);
    this.props.reload();
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

  // Automatically shortens timer number inputs to a max length of two characters
  handleNumberInput = ({target}) => {
    target.value = target.value.slice(0, 2);
  }

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
              type="text" 
              id={"timer-" + this.state.id} 
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
                <div className="timer-input-wrapper">
                  <label 
                    className="length-input-label"
                    htmlFor="timerMinutes"  
                  >
                    minutes:
                  </label>
                  <div 
                    className="timer-input-placeholder" 
                    id={"timer-minutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                    <input 
                      maxLength="2" 
                      className="length-input" 
                      type="number"
                      onInput={this.handleNumberInput}
                      id={"timer-minutes-input-" + this.state.id} 
                      value={this.state.timerMinutes}
                      onFocus={this.handleInputFocus}
                      onBlur={this.handleInputBlur}
                      onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("currentTime"))} 
                      name="timerMinutes"
                      autoComplete="off"
                      pattern="\d*"
                  />
                </div>
              </div>
            </div>

            <div className="break-inputs">
              <h3>short break</h3>
              <div className="length-input-wrapper">
                <div className="timer-input-wrapper">
                  <label className="length-input-label">
                    minutes:
                  </label>
                  <div 
                    className="timer-input-placeholder" 
                    id={"break-minutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                  <input 
                    maxLength="2"
                    onInput={this.handleNumberInput} 
                    className="length-input" 
                    type="number"
                    id={"break-minutes-input-" + this.state.id}
                    value={this.state.breakMinutes}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur} 
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("breakTime"))} 
                    name="breakMinutes"
                    autoComplete="off"
                    pattern="\d*"
                  />
                </div>
              </div>
            </div> 

            <div className="break-inputs">
              <h3>long break</h3>
              <div className="length-input-wrapper">
                <div className="timer-input-wrapper">
                  <label className="length-input-label">
                    minutes:
                  </label>
                  <div 
                    className="timer-input-placeholder" 
                    id={"longBreak-minutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                  <input 
                    maxLength="2"
                    onInput={this.handleNumberInput}
                    className="length-input" 
                    type="number"
                    id={"longBreak-minutes-input-" + this.state.id} 
                    value={this.state.longBreakMinutes}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("longBreakTime"))} name="longBreakMinutes"
                    autoComplete="off"
                    pattern="\d*"
                    />
                </div>
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
        <div id={this.props.data._id} className="timer">
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
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="timerHours">
                  hours:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"timer-hours-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput}
                  className="length-input"
                  id={"timer-hours-input-" + this.state.id}
                  type="number" 
                  value={this.state.timerHours} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="timerHours"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="timerMinutes">
                  minutes:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"timer-minutes-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput} 
                  className="length-input"
                  id={"timer-minutes-input-" + this.state.id}
                  type="number" 
                  value={this.state.timerMinutes}
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="timerMinutes"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="timerSeconds">
                  seconds:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"timer-seconds-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput}
                  className="length-input"
                  id={"timer-seconds-input-" + this.state.id}
                  type="number"
                  value={this.state.timerSeconds} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="timerSeconds"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
               
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
