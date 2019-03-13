import React, { Component } from 'react';
import './Timer.css';

export default class Timer extends Component {

  state = {
    currentTime: 0,
    timerEnd: null,
    intervalNum: null,
    timerRunning: false,
    timerHours: "00",
    timerMinutes: "00",
    timerSeconds: "00"

  }

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

  calculateAndRenderTimer = () => {
    const currentTime = this.state.currentTime;
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime - (minutes * 60);

    if (currentTime === 0) {
      return "00:00:00";
    }
    else if (currentTime < 10 ) {
      return "00:00:0" + currentTime;
    }
    else if (currentTime < 60 ) {
      return "00:00:" + currentTime;
    }
    else if (currentTime < 600) {

      if (seconds < 60 && seconds >= 10) {
        return "00:0" + minutes + ":" + seconds;
      }
      else if (seconds < 10) {
        return "00:0" + minutes + ":0" + seconds;
      }  
    }
    else if (currentTime < 3600) {
      if (seconds < 60 && seconds >= 10) {
        return "00:" + minutes + ":" + seconds;
      }
      else if (seconds < 10) {
        return "00:" + minutes + ":0" + seconds;
      }  
    }
    else if ( currentTime < 86400) {
      const hours = Math.floor(currentTime / 3600);
      const hourMinutes = Math.floor((currentTime - (hours * 3600)) / 60);
      const hourSeconds = currentTime - (hours * 3600) - (hourMinutes * 60);

      if ( hours < 10 && hourMinutes < 10 && hourSeconds < 10) {
        return "0" + hours + ":0" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hours < 10 && hourMinutes < 10) {
        return "0" + hours + ":0" + hourMinutes + ":" + hourSeconds;
      }
      else if (hours < 10) {
        return "0" + hours + ":" + hourMinutes + ":" + hourSeconds;
      }
      else if (hourMinutes < 10 && hourSeconds < 10) {
        return hours + ":0" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hours < 10 && hourSeconds < 10) {
        return "0" + hours + ":" + hourMinutes + ":0" + hourSeconds;
      }
      else if (hourMinutes < 10) {
        return hours + ":0" + hourMinutes + ":" + hourSeconds;
      }
      else if (hourSeconds < 10) {
        return hours + ":" + hourMinutes + ":0" + hourSeconds;
      }
      else {
        return hours + ":" + hourMinutes + ":" + hourSeconds;
      }

    }
    else if (currentTime >= 86400) { 
      clearInterval(this.state.intervalNum);
      return "24:00:00";
    }
  }

  

  componentDidMount() {
    
  }

  timerCallback = () => {
    
    const timerLengthInteger = this.calculateTimeIntegerFromInputLength();
    if (this.state.currentTime >= timerLengthInteger) {
      const alarm = new Audio(require('./audio/chime.wav'));
      alarm.play();
      this.handleStopClick();
    }  else {
      this.setState({
        currentTime: this.state.currentTime + 1
      })
    }
    
    
  }

  handleStartClick = () => {
    const timer = setInterval(this.timerCallback,
    1000);

    this.setState({
      intervalNum: timer,
      timerRunning: true
    })

    
  }

  handleStopClick = () => {
    clearInterval(this.state.intervalNum);
    this.setState({
      timerRunning: false
    })
  }

  handleResetClick = () => {

    this.setState({
      currentTime: 0,
      timerEnd: null
    })
  }

  handleInputChange = ({target}) => {
    this.setState({
      [target.name]: target.value
    })
  }


  render() {
    return (
      <div className="timer">
        <div className="timer-counter">{this.calculateAndRenderTimer()}</div>
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
    )
  }
}
