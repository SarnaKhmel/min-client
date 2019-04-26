import React, {Component} from 'react';
import './Timer.css';
import AlertDialog from '../AlertDialog/AlertDialog';
import {updateTimer, deleteTimer} from '../../../services/timers';
import calculateAndRenderTimer from '../../../modules/timerScreen';

class Timer extends Component {

  state = {
    name: "",
    id: null,
    isPomodoro: false,
    isShortBreak: false,
    isLongBreak: false,
    timerRunning: false,
    intervalNumber: null,
    hourInput: "",
    minuteInput: "",
    secondInput: "",
    shortBreakMinuteInput: "",
    longBreakMinuteInput: "",
    timerLength: 0,
    currentTime: 0,
    shortBreakLength: 0,
    shortBreakTime: 0,
    longBreakLength: 0,
    longBreakTime: 0,
    pomodoroCounter: 0,
    alertOpen: false,
    alertTitle: "",
    alertContent: ""
  }

  async componentDidMount() {
    await this.storeTimerPropsInState();
  }

  componentDidUpdate() {
    this.updateTimerInDB();
  }

   // Sets state.timerLength from the input values loaded from DB
   setTimerLengthFromInput = () => {
    const timerLength = this.calculateTimeIntegerFromSumOfInputs();
    this.setState({
      timerLength: timerLength
    });
  }

  // Loads the timer by setting all props.data values to state
  storeTimerPropsInState = async () => {
    const timerProps = this.props.data;

    const timerObj = {
      name: timerProps.name,
      id: timerProps._id,
      timerLength: timerProps.timerLength || 0,
      currentTime: timerProps.currentTime || 0,
      shortBreakLength: timerProps.shortBreakLength || 0,
      shortBreakTime: timerProps.shortBreakTime || 0,
      longBreakLength: timerProps.longBreakLength || 0,
      longBreakTime: timerProps.longBreakTime || 0,
      longBreakMinuteInput: timerProps.longBreakMinuteInput || "",
      intervalNumber: timerProps.intervalNumber || null,
      timerRunning: timerProps.timerRunning || false,
      hourInput: timerProps.hourInput || "",
      minuteInput: timerProps.minuteInput || "",
      secondInput: timerProps.secondInput || "",
      isPomodoro: timerProps.isPomodoro || false,
      shortBreakMinuteInput: timerProps.shortBreakMinuteInput || "",
      isShortBreak: timerProps.isShortBreak || false,
      isLongBreak: timerProps.isLongBreak || false,
      pomodoroCounter: timerProps.pomodoroCounter || 0
    }

    await this.setState(timerObj);
    this.hidePlaceholders();
    this.setTimerLengthFromInput();
  };

  // Removes unnecessary keys from state to prepare the timer object for POST to DB
  filterStateForTimerPost = () => {
    const rawStateCopy = Object.assign({}, this.state);

    const stateKeysToRemove = ['alertOpen', 'alertTitle', 'alertContent'];

    const timerFilteredFromState = Object.keys(rawStateCopy)
              .filter(key => !stateKeysToRemove.includes(key))
              .reduce((obj, key) => {
                obj[key] = rawStateCopy[key];
                return obj;
              }, {});
    
    timerFilteredFromState.userId = this.props.userId;

    return timerFilteredFromState;
  };

  // Posts the current timer object filtered from state to the database for storage
  updateTimerInDB = async () => {
    const timerID = this.props.data._id;
    const currentTimerObject = this.filterStateForTimerPost();
    await updateTimer(timerID, currentTimerObject);
  };

  // Handles click event for start button by beginning a setInterval call and setting the interval number to state and setting state.timerRunning to true
  handleStartClick = () => {
    const valid = this.validateTimerInput();
    if (!valid) return;
    const timer = setInterval(this.timerCallback, 1000);
    this.setState({
      intervalNumber: timer,
      timerRunning: true
    })  
  };

  // Handles click event for stop button by clearing the timer interval and setting state.timerRunning to false
  handleStopClick = () => {
    clearInterval(this.state.intervalNumber);
    this.setState({
      timerRunning: false
    })
  };

  // Handles click event for reset button by clearing the timer interval, setting the timer display and all inputs to zero and setting the state.timerRunning value to false to prevent the alarm from triggering
  handleResetClick = async () => {
    const timer = document.getElementById(this.state.id);
    timer.lastChild.style.display = "none";

    clearInterval(this.state.intervalNumber);

    await this.setState({
      currentTime: 0,
      shortBreakTime: 0,
      timerLength: 0,
      shortBreakLength: 0,
      longBreakLength: 0, 
      hourInput: "",
      minuteInput: "",
      secondInput: "",
      shortBreakMinuteInput: "",
      longBreakMinuteInput: "",
      timerRunning: false,
      isShortBreak: false,
      isLongBreak: false
    });

    this.resetAllPlaceholders();  
  };

  // Gets timerId from parent div and removes the timer from the DB
  handleRemoveTimer = async ({target}) => {
    const timerId = target.parentElement.id;
    await deleteTimer(timerId);
    this.props.reload();
  };

  // Automatically shortens timer number inputs to a max length of two characters
  handleNumberInput = ({target}) => {
    target.value = target.value.slice(0, 2);
  };

  // Validates the regular timer length input to ensure that it is greater than zero seconds, or validates all pomodoro inputs to ensure that each one is greater than zero seconds
  validateTimerInput = () => {
    const timer = document.getElementById(this.props.data._id);

    if (this.state.isPomodoro) {
      if (this.state.timerLength === 0 || this.state.shortBreakLength === 0 || this.state.longBreakLength === 0) {
        timer.lastChild.style.display = "block";
        return false;
      } else {
        timer.lastChild.style.display = "none";
        return true;
      }
    } else {
      if (this.state.timerLength === 0){
        timer.lastChild.style.display = "block";
        return false;
      } else {
        timer.lastChild.style.display = "none";
        return true;
      }
    }
  };

  // Calculates the number of seconds equivalent to the total of the inputted hours, minutes and seconds
  calculateTimeIntegerFromSumOfInputs = () => {
    let hoursToSeconds = parseInt(this.state.hourInput) * 3600;
    let minutesToSeconds = parseInt(this.state.minuteInput) * 60;
    let seconds = parseInt(this.state.secondInput);

    if (this.state.hourInput === "") {
      hoursToSeconds = 0;
    }
    if (this.state.minuteInput === "") {
      minutesToSeconds = 0;
    }
    if (this.state.secondInput === "") {
      seconds = 0;
    }
    return hoursToSeconds + minutesToSeconds + seconds;
  };

  // Calculates the number of seconds equivalent to an inputted amount of minutes, used only in Pomodoro timer
  calculateTimeIntegerFromMinuteInput = (inputMinutes) => {
    if (!inputMinutes || inputMinutes === "") return 0;
    return parseInt(inputMinutes) * 60;
  };

  // Sets the state for timer hours, minutes and seconds based on the user's input
  handleInputChange = (callback, e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, callback)
  };

  // Callback for handleInputChange that sets the given portion of state equal to the provided minutes value calculated in seconds format
  setStateFromMinuteInput = (statePortion) => {
    let time; 
    switch (statePortion) {
      case "currentTime":
        time = this.calculateTimeIntegerFromMinuteInput(this.state.minuteInput);
        this.setState({
          timerLength: time,
          currentTime: time
        });
        break;
      case "shortBreakTime":
        time = this.calculateTimeIntegerFromMinuteInput(this.state.shortBreakMinuteInput);
        this.setState({
          shortBreakLength: time,
          shortBreakTime: time
        });
        break;
      case "longBreakTime":
        time = this.calculateTimeIntegerFromMinuteInput(this.state.longBreakMinuteInput);
        this.setState({
          longBreakLength: time,
          longBreakTime: time
        });
        break;
      default:
        return;
    }
  };

  // Callback for handleInputChange that sets state.currentTime to match the inputted timer length
  setCurrentTimeFromInput = () => {
    const timerLength = this.calculateTimeIntegerFromSumOfInputs();
    this.setState({
      currentTime: timerLength,
      timerLength: timerLength
    });
  };

  // Conditionally renders the amount of seconds remaining on the timer screen dependent on state.isShortBreak and state.isLongBreak. Used only in Pomodoro timer
  conditionallyRenderCurrentTimeOrBreakTime = () => {
    if (this.state.isShortBreak && this.state.isLongBreak) {
      return calculateAndRenderTimer(this.state.longBreakTime, this.state.intervalNumber);
    }
    else if (this.state.isShortBreak) {
      return calculateAndRenderTimer(this.state.shortBreakTime, this.state.intervalNumber);
    } else {
      return calculateAndRenderTimer(this.state.currentTime, this.state.intervalNumber);
    }
  };

  // Renders the Pomodoro timer's class conditionally based on state.isShortBreak, thus changing the appearance of the timer
  renderPomodoroClass = () => {
    return this.state.isShortBreak ? "timer pom break" : "timer pom";
  };

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
  };
  
  // Hides the "timer name" label when user clicks on the timerName input field
  handleNameFocus = () => {
    const label = document.getElementById('label-' + this.state.id);
    label.style.display = "none";
  };

  // Shows the "timer name" label when user focus leaves the timerName input field, if state.name is blank
  handleNameUnfocus = () => {
    const label = document.getElementById('label-' + this.state.id);
    if (this.state.name === "") label.style.display = "block";
  };

  // Closes the timer alertDialog window
  handleAlertClose = () => {
    this.setState({ alertOpen: false });
  };

  // Finds the placeholder div by using the reformatted target div's id to find it
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
  };

  // Hides all input placeholder divs who's corresponding values in state are not empty
  hidePlaceholders = () => {
    const hoursPlaceholder = document.getElementById("timer-hours-placeholder-" + this.state.id);
    if (hoursPlaceholder && this.state.hourInput) hoursPlaceholder.style.display = "none";

    const minutesPlaceholder = document.getElementById("timer-minutes-placeholder-" + this.state.id);
    if (minutesPlaceholder && this.state.minuteInput) minutesPlaceholder.style.display = "none";

    const secondsPlaceholder = document.getElementById("timer-seconds-placeholder-" + this.state.id);
    if (secondsPlaceholder && this.state.secondInput) secondsPlaceholder.style.display = "none";
    const shortBreakMinuteInputPlaceholder = document.getElementById("break-minutes-placeholder-" + this.state.id);
    if (shortBreakMinuteInputPlaceholder && this.state.shortBreakMinuteInput) shortBreakMinuteInputPlaceholder.style.display = "none";

    const longBreakMinuteInputPlaceholder = document.getElementById("longBreak-minutes-placeholder-" + this.state.id);
    if (longBreakMinuteInputPlaceholder && this.state.longBreakMinuteInput) longBreakMinuteInputPlaceholder.style.display = "none";

    const label = document.getElementById('label-' + this.state.id);
    if (label && this.state.name) label.style.display = "none";
  };

  // Switches all input placeholder divs to visible, thus hiding the empty input values. To be used in handleResetClick
  resetAllPlaceholders = () => {
    const hoursPlaceholder = document.getElementById("timer-hours-placeholder-" + this.state.id);
    const minutesPlaceholder = document.getElementById("timer-minutes-placeholder-" + this.state.id);
    const secondsPlaceholder = document.getElementById("timer-seconds-placeholder-" + this.state.id);
    const shortBreakMinuteInputPlaceholder = document.getElementById("break-minutes-placeholder-" + this.state.id);
    const longBreakMinuteInputPlaceholder = document.getElementById("longBreak-minutes-placeholder-" + this.state.id);
    if (hoursPlaceholder) hoursPlaceholder.style.display = "block";
    if (minutesPlaceholder) minutesPlaceholder.style.display = "block";
    if (secondsPlaceholder) secondsPlaceholder.style.display = "block";
    if (shortBreakMinuteInputPlaceholder) shortBreakMinuteInputPlaceholder.style.display = "block";
    if (longBreakMinuteInputPlaceholder) longBreakMinuteInputPlaceholder.style.display = "block";
  };

  // Converts seconds to minutes for break alert message
  convertSecondsToMinutes = (input) => {
    return Math.round(input / 60);
  };

  // This method runs each time the timer interval is completed to either decrease state.currentTime by one and allow the timer to count down, or triggering the alarm if state.timerRunning is true and the timer has reached 0
  timerCallback = async () => {
    if(this.state.isPomodoro) {
      if (this.state.isShortBreak) {
        if (this.state.pomodoroCounter % 4 === 0) {
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
              isShortBreak: false,
              isLongBreak: false,
              currentTime: this.state.timerLength,
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
          if (this.state.shortBreakTime === 0 && this.state.timerRunning === true) {
            const alarm = new Audio(require('./audio/chime.wav'));
            alarm.play();
            this.setState({
              isShortBreak: false,
              currentTime: this.state.timerLength,
              alertOpen: true,
              alertTitle: "break's over!",
              alertContent: "time to get back to work"
            });
          }  else {
            this.setState({
              shortBreakTime: this.state.shortBreakTime - 1
            })
          }
        }   
      }
      else {
        if (this.state.currentTime === 0 && this.state.timerRunning === true) {
          const alarm = new Audio(require('./audio/chime.wav'));
          alarm.play();
          this.setState({
            isShortBreak: true,
            shortBreakTime: this.state.shortBreakLength,
            longBreakTime: this.state.longBreakLength,
            pomodoroCounter: this.state.pomodoroCounter + 1,
            alertOpen: true,
            alertTitle: "short break time!",
            alertContent: `time for a ${this.convertSecondsToMinutes(this.state.shortBreakLength)} minute break`
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
          isShortBreak={this.state.isShortBreak}
        />
        <div id={this.state.id} className={this.renderPomodoroClass()}>
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
                    htmlFor="minuteInput"  
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
                      value={this.state.minuteInput}
                      onFocus={this.handleInputFocus}
                      onBlur={this.handleInputBlur}
                      onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("currentTime"))} 
                      name="minuteInput"
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
                    value={this.state.shortBreakMinuteInput}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur} 
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("shortBreakTime"))} 
                    name="shortBreakMinuteInput"
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
                    value={this.state.longBreakMinuteInput}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinuteInput("longBreakTime"))} name="longBreakMinuteInput"
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
          isShortBreak={true}
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
          <div className="timer-counter">{calculateAndRenderTimer(this.state.currentTime, this.state.intervalNumber)}</div>
          <div className="timer-buttons-and-inputs">
            <div className="length-input-wrapper">
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="hourInput">
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
                  value={this.state.hourInput} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="hourInput"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="minuteInput">
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
                  value={this.state.minuteInput}
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="minuteInput"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="secondInput">
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
                  value={this.state.secondInput} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="secondInput"
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

export default Timer;
