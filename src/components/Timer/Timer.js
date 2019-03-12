import React, { Component } from 'react';
import './Timer.css';

export default class Timer extends Component {
  render() {
    return (
      <div className="timer">
        <div className="timer-buttons">
            <div className="timer-start">start</div>
            <div className="timer-stop">stop</div>
        </div>    
      </div>
    )
  }
}
