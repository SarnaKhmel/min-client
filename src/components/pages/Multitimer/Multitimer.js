import React, { useContext, useEffect } from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import './Multitimer.css';
import Timer from '../../shared/Timer/Timer';
import {AuthContext} from '../../shared/Auth';
import {postTimer} from '../../../services/timers';

const Multitimer = (props) => {

  const {user} = useContext(AuthContext);

  useEffect(() => {
    handleLoadTimers();
}, []);

  const handleLoadTimers = () => {
    if (user.new) {
      postTwoNewTimers();
    }
  };

  const postTwoNewTimers = async () => {

    const requestObj = {
      userId: user._id,
      name: "",
      isPomodoro: false,
      currentTime: 0, 
      intervalNum: null,
      timerRunning: false,
      timerHours: "",
      timerMinutes: "",
      timerSeconds: "",
      
    };

    const response = await postTimer(requestObj);

    console.log("TIMER ONE", response.data);

    const response2 = await postTimer(requestObj);

    console.log("TIMER TWO", response2.data);
  }
 
  const handleAddTimer = () => {
    props.addTimer({
      id: uuid(), 
      currentTime: 0, 
      intervalNum: null,
      timerRunning: false,
      timerHours: "00",
      timerMinutes: "00",
      timerSeconds: "00"
    });
  };
    
  const renderTimersFromReduxStore = () => {
  return props.timers.map(timer => <Timer userId={user._id} data={timer} key={timer.id} id={timer.id}/>);
  };

  return (
      <div id="multi-wrapper">
          <div className="add-timer-button" onClick={handleAddTimer}>add a timer</div>
          <div className="timers-container">
          {renderTimersFromReduxStore()}
          </div> 
      </div>
  );
};

const mapStateToProps = function(state) {
    return {
      timers: state.timers.timers
    }
};
  
export default connect(mapStateToProps, actions)(Multitimer);