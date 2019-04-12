import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import './Multitimer.css';
import Timer from '../../shared/Timer/Timer';

const Multitimer = (props) => {
    const handleAddTimer = () => {
        props.addTimer({
          id: uuid(), 
          name: "test",  
          currentTime: 0, 
          intervalNum: null,
          timerRunning: false,
          timerHours: "00",
          timerMinutes: "00",
          timerSeconds: "00"
        });
      }
    
    const renderTimersFromReduxStore = () => {
    return props.timers.map(timer => <Timer  data={timer} key={uuid()} />);
    }

    return (
        <div id="multi-wrapper">
            <div className="add-timer-button" onClick={handleAddTimer}>add a timer</div>
            <div className="timers-container">
            <Timer isPomodoro={false} />
            <Timer isPomodoro={false} />
            {renderTimersFromReduxStore()}
            </div> 
        </div>
    )
};

const mapStateToProps = function(state) {
    return {
      timers: state.timers.timers
    }
};
  
export default connect(mapStateToProps, actions)(Multitimer);