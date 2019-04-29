import React, {Component} from 'react';
import './Timer.css';
import AlertDialog from '../AlertDialog/AlertDialog';
import {updateTimer, deleteTimer} from '../../../services/timers';
import calculateAndRenderTimer from '../../../modules/timerScreen';

class Timer extends Component {

  defaultState = {
    id: this.props.data._id,
    name: "",
    isPomodoro: false,
    isShortBreak: false,
    isLongBreak: false,
    timerRunning: false,
    intervalNumber: null,
    hours: "",
    minutes: "",
    seconds: "",
    shortBreakMinutes: "",
    longBreakMinutes: "",
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
  };

  state = Object.assign({}, this.defaultState);

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

  // Loads the timer by setting all truthy props.data values to state
  storeTimerPropsInState = async () => {
    const timerProps = this.props.data;
    const newStateObject = {};

    for (let key in this.defaultState) {
      if (key === "id") continue;
      if (timerProps[key]) {
        newStateObject[key] = timerProps[key];
      } else {
        newStateObject[key] = this.defaultState[key];
      }
    }
   
    await this.setState(newStateObject);
    this.handlePlaceholders();
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

  // Handles click event for reset button by clearing the timer interval and resetting the state to this.defaultState, thus clearing the timer display and inputs
  handleResetClick = async () => {
    const timer = document.getElementById(this.state.id);
    timer.lastChild.style.display = "none";

    clearInterval(this.state.intervalNumber);
    
    const defaultStateDuplicate = Object.assign({}, this.defaultState);
    defaultStateDuplicate.name = this.state.name;
    defaultStateDuplicate.isPomodoro = this.state.isPomodoro;

    await this.setState(defaultStateDuplicate);

    this.handlePlaceholders();  
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
      }
    } else {
      if (this.state.timerLength === 0){
        timer.lastChild.style.display = "block";
        return false;
      } 
    }

    timer.lastChild.style.display = "none";
    return true;
  };

  // Calculates the number of seconds equivalent to the total of the inputted hours, minutes and seconds
  calculateTimeIntegerFromSumOfInputs = () => {
    let hoursToSeconds = parseInt(this.state.hours) * 3600;
    let minutesToSeconds = parseInt(this.state.minutes) * 60;
    let seconds = parseInt(this.state.seconds);

    if (this.state.hours === "") {
      hoursToSeconds = 0;
    }
    if (this.state.minutes === "") {
      minutesToSeconds = 0;
    }
    if (this.state.seconds === "") {
      seconds = 0;
    }
    return hoursToSeconds + minutesToSeconds + seconds;
  };

  // Calculates the number of seconds equivalent to an inputted amount of minutes, used only in Pomodoro timer
  calculateTimeIntegerFromMinutes = (inputMinutes) => {
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
  setStateFromMinutes = (statePortion) => {
    let time; 
    switch (statePortion) {
      case "currentTime":
        time = this.calculateTimeIntegerFromMinutes(this.state.minutes);
        this.setState({
          timerLength: time,
          currentTime: time
        });
        break;
      case "shortBreakTime":
        time = this.calculateTimeIntegerFromMinutes(this.state.shortBreakMinutes);
        this.setState({
          shortBreakLength: time,
          shortBreakTime: time
        });
        break;
      case "longBreakTime":
        time = this.calculateTimeIntegerFromMinutes(this.state.longBreakMinutes);
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
  renderPomodoroBreakTime = () => {
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

  // Closes the timer alertDialog window
  handleAlertClose = () => {
    this.setState({ alertOpen: false });
  };

  // Finds the placeholder div by using the reformatted target div's id to find it
  findPlaceholderFromInput = (target) => {
    const idArray = target.id.split("-");
    const placeholderIdPrefix = idArray[0];
    const placeholderIdNum = idArray[1];
    const placeholderId = placeholderIdPrefix + "-placeholder-" + placeholderIdNum;
    return document.getElementById(placeholderId);
  };

  // Pulls the first word of a div id to be used to access a portion of state
  getStateFieldNameFromId = (id) => {
      return id.split("-")[0];
  };

  // Finds all input placeholder divs and hides or shows them dependent on their value in state
  handlePlaceholders = () => {
    const placeholderNames = ["hours", "minutes", "seconds", "shortBreakMinutes", "longBreakMinutes", "name"];

    for (let name of placeholderNames) {
      const placeholderId = name + "-placeholder-" + this.state.id;
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        placeholder.style.display = this.state[name] ? "none" : "block"
      };
    }
  };

  // Converts seconds to minutes for break alert message
  convertSecondsToMinutes = (input) => {
    return Math.round(input / 60);
  };

  // This method runs each time the timer interval is completed to either decrease state.currentTime by one and allow the timer to count down, or trigger the alarm if state.timerRunning is true and the timer has reached 0
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
            <label className="timer-name-label" id={'name-placeholder-' + this.state.id} htmlFor={"name-" + this.state.id}>
              timer name
            </label>
            <input 
              name="name" 
              className="timer-name" 
              type="text" 
              id={"name-" + this.state.id} 
              value={this.state.name} 
              maxLength="15"
              onChange={this.handleInputChange.bind(this, null)} 
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
          </div>
          <div className="timer-counter">{this.renderPomodoroBreakTime()}</div>
          <div className="pom-input-container">
          
            <div className="pom-inputs">
              <h3>timer</h3>
              <div className="length-input-wrapper">
                <div className="timer-input-wrapper">
                  <label 
                    className="length-input-label"
                    htmlFor="minutes"  
                  >
                    minutes:
                  </label>
                  <div 
                    className="timer-input-placeholder" 
                    id={"minutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                    <input 
                      maxLength="2" 
                      className="length-input" 
                      type="number"
                      onInput={this.handleNumberInput}
                      id={"minutes-" + this.state.id} 
                      value={this.state.minutes}
                      onFocus={this.handleInputFocus}
                      onBlur={this.handleInputBlur}
                      onChange={this.handleInputChange.bind(this, () => this.setStateFromMinutes("currentTime"))} 
                      name="minutes"
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
                    id={"shortBreakMinutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                  <input 
                    maxLength="2"
                    onInput={this.handleNumberInput} 
                    className="length-input" 
                    type="number"
                    id={"shortBreakMinutes-" + this.state.id}
                    value={this.state.shortBreakMinutes}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur} 
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinutes("shortBreakTime"))} 
                    name="shortBreakMinutes"
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
                    id={"longBreakMinutes-placeholder-" + this.state.id}
                  >
                    00
                  </div>
                  <input 
                    maxLength="2"
                    onInput={this.handleNumberInput}
                    className="length-input" 
                    type="number"
                    id={"longBreakMinutes-" + this.state.id} 
                    value={this.state.longBreakMinutes}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    onChange={this.handleInputChange.bind(this, () => this.setStateFromMinutes("longBreakTime"))} name="longBreakMinutes"
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
            <label className="timer-name-label" id={'name-placeholder-' + this.state.id} htmlFor={"name-" + this.state.id}>
              timer name
            </label>
            <input 
              name="name" 
              className="timer-name" 
              type="text" id={"name-" + this.state.id} 
              value={this.state.name} 
              maxLength="15"
              onChange={this.handleInputChange.bind(this, null)} 
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
          </div>
          <div className="timer-counter">{calculateAndRenderTimer(this.state.currentTime, this.state.intervalNumber)}</div>
          <div className="timer-buttons-and-inputs">
            <div className="length-input-wrapper">
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="hours">
                  hours:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"hours-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput}
                  className="length-input"
                  id={"hours-" + this.state.id}
                  type="number" 
                  value={this.state.hours} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="hours"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="minutes">
                  minutes:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"minutes-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput} 
                  className="length-input"
                  id={"minutes-" + this.state.id}
                  type="number" 
                  value={this.state.minutes}
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="minutes"
                  autoComplete="off"
                  pattern="\d*"
                />
              </div>
              
              <div className="timer-input-wrapper">
                <label className="length-input-label" htmlFor="seconds">
                  seconds:
                </label>
                <div 
                  className="timer-input-placeholder" 
                  id={"seconds-placeholder-" + this.state.id}
                >
                  00
                </div>
                <input 
                  maxLength="2"
                  onInput={this.handleNumberInput}
                  className="length-input"
                  id={"seconds-" + this.state.id}
                  type="number"
                  value={this.state.seconds} 
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  onChange={this.handleInputChange.bind(this, this.setCurrentTimeFromInput)} 
                  name="seconds"
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
