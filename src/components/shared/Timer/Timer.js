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
    isBreak: false,
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
    const timerLength = this.calculateTimeIntegerFromSumOfInputs(
      this.state.hours,
      this.state.minutes,
      this.state.seconds
    );
    this.setState({
      timerLength: timerLength
    });
  };

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

   // Callback function for MultiTimer
   multiTimerCallBack = (currentTime, timerRunning) => {
    if (currentTime && timerRunning) {
      return this.setState({
        currentTime: this.state.currentTime - 1
      });  
    }
    
    const alarm = new Audio(require('./audio/chime.wav'));
    alarm.play();
    this.setState({
      alertOpen: true,
      alertTitle: "time's up!",
      alertContent: `your ${this.state.name} timer has finished`
    })
    this.handleStopClick();
  };

  // Callback function for when Pomodoro timer is running, not in a break
  pomodoroTimerHandler = (currentTime, timerRunning) => {
    if (currentTime && timerRunning) {
      return this.setState({
        currentTime: this.state.currentTime - 1
      });
    }

    const alarm = new Audio(require('./audio/chime.wav'));
    alarm.play();
    this.setState({
      isBreak: true,
      shortBreakTime: this.state.shortBreakLength,
      longBreakTime: this.state.longBreakLength,
      pomodoroCounter: this.state.pomodoroCounter + 1,
      alertOpen: true,
      alertTitle: "short break time!",
      alertContent: `time for a ${this.convertSecondsToMinutes(this.state.shortBreakLength)} minute break`
    });   
  };

  // Callback function for when Pomodoro has reached a short break
  pomodoroShortBreakHandler = (shortBreakTime, timerRunning) => {
    if (shortBreakTime && timerRunning) {
      return this.setState({
        shortBreakTime: shortBreakTime - 1
      })
    }
    
    const alarm = new Audio(require('./audio/chime.wav'));
    alarm.play();
    this.setState({
      isBreak: false,
      currentTime: this.state.timerLength,
      alertOpen: true,
      alertTitle: "break's over!",
      alertContent: "time to get back to work"
    });
  };

  // Callback function for when Pomodoro has reached a long break
  pomodoroLongBreakHandler = async (longBreakLength, longBreakTime, timerRunning) => {
    await this.setState({
      isLongBreak: true
    });

    if (longBreakLength === longBreakTime) {
      this.setState({
        alertOpen: true,
        alertTitle: "long break time!",
        alertContent: `time for a ${this.convertSecondsToMinutes(longBreakLength)} minute break`
      });
    }

    if (longBreakTime && timerRunning) {
      return this.setState({
        longBreakTime: longBreakTime - 1
      });
    }
    
    const alarm = new Audio(require('./audio/chime.wav'));
    alarm.play();
    this.setState({
      isBreak: false,
      isLongBreak: false,
      currentTime: this.state.timerLength,
      alertOpen: true,
      alertTitle: "break's over!",
      alertContent: "time to get back to work"
    });
  };

  // Callback function for Pomodoro
  pomodoroCallback = (currentTime, isBreak, shortBreakTime, longBreakTime, longBreakLength, timerRunning, pomodoroCounter) => {
    if (!isBreak) {
      return this.pomodoroTimerHandler(currentTime, timerRunning);
    }

    const isNowLongBreak = pomodoroCounter % 4 === 0;
    if (!isNowLongBreak) {
      return this.pomodoroShortBreakHandler(shortBreakTime, timerRunning);
    } 

    this.pomodoroLongBreakHandler(longBreakLength, longBreakTime, timerRunning);
  };

  // Callback function for the timer setInterval started by handleStartClick
  // Handles all scenarios for Multitimer or Pomodoro function
  timerCallback = async (
    currentTime, 
    isBreak, 
    shortBreakTime, 
    longBreakTime, 
    longBreakLength, 
    timerRunning, 
    pomodoroCounter
    ) => {

      if (!this.state.isPomodoro) {
        return this.multiTimerCallBack(currentTime, timerRunning);
      }

      this.pomodoroCallback(
        currentTime, 
        isBreak, 
        shortBreakTime, 
        longBreakTime, 
        longBreakLength, 
        timerRunning,
        pomodoroCounter
      );       
  };

  // Handles click event for start button by beginning a setInterval call and setting the interval number to state and setting state.timerRunning to true
  handleStartClick = async () => {
    const valid = this.validateTimerInput();
    if (!valid) return;

    await this.setState({
      timerRunning: true
    });

    const timer = setInterval(
      () => this.timerCallback(
        this.state.currentTime, 
        this.state.isBreak, 
        this.state.shortBreakTime, 
        this.state.longBreakTime, 
        this.state.longBreakLength, 
        this.state.timerRunning,
        this.state.pomodoroCounter
      ), 
      1000
    );
    this.setState({
      intervalNumber: timer
    });  
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
  calculateTimeIntegerFromSumOfInputs = (hours = "", minutes = "", seconds = "") => {
    let hoursToSeconds = parseInt(hours) * 3600;
    let minutesToSeconds = parseInt(minutes) * 60;
    let secondsToSeconds = parseInt(seconds);

    if (hours === "") {
      hoursToSeconds = 0;
    }
    if (minutes === "") {
      minutesToSeconds = 0;
    }
    if (seconds === "") {
      secondsToSeconds = 0;
    }
    return hoursToSeconds + minutesToSeconds + secondsToSeconds;
  };

   // Callback for handleInputChange that sets the given portion of state equal to the provided minutes value calculated in seconds format
   setStateFromMinutes = (statePortion) => {
    let time; 
    switch (statePortion) {
      case "currentTime":
        time = this.calculateTimeIntegerFromSumOfInputs(
          "",
          this.state.minutes,
          ""
        );
        this.setState({
          timerLength: time,
          currentTime: time
        });
        break;
      case "shortBreakTime":
        time = this.calculateTimeIntegerFromSumOfInputs(
          "", 
          this.state.shortBreakMinutes,
          ""
        );
        this.setState({
          shortBreakLength: time,
          shortBreakTime: time
        });
        break;
      case "longBreakTime":
        time = this.calculateTimeIntegerFromSumOfInputs(
          "",
          this.state.longBreakMinutes,
          ""
        );
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
    const timerLength = this.calculateTimeIntegerFromSumOfInputs(
      this.state.hours,
      this.state.minutes,
      this.state.seconds
    );
    this.setState({
      currentTime: timerLength,
      timerLength: timerLength
    });
  };

  // Sets the state for timer hours, minutes and seconds based on the user's input
  handleInputChange = (callback, e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, callback)
  };

  // Conditionally renders the amount of seconds remaining on the Pomodoro screen dependent on state.isBreak and state.isLongBreak
  renderPomodoroScreen = () => {
    if (this.state.isBreak && this.state.isLongBreak) {
      return calculateAndRenderTimer(this.state.longBreakTime, this.state.intervalNumber);
    }
    else if (this.state.isBreak) {
      return calculateAndRenderTimer(this.state.shortBreakTime, this.state.intervalNumber);
    } else {
      return calculateAndRenderTimer(this.state.currentTime, this.state.intervalNumber);
    }
  };

  // Renders the Pomodoro timer's class conditionally based on state.isBreak, thus changing the appearance of the timer
  renderPomodoroClass = () => {
    return this.state.isBreak ? "timer pom break" : "timer pom";
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
          <div className="timer-counter">{this.renderPomodoroScreen()}</div>
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
          isBreak={true}
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
