import React, { useContext, useEffect, useState } from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import './Multitimer.css';
import Timer from '../../shared/Timer/Timer';
import {AuthContext} from '../../shared/Auth';
import {postTimer, getMultiTimers} from '../../../services/timers';

const Multitimer = (props) => {

  const {user} = useContext(AuthContext);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    handleLoadTimers();
}, []);

  const handleLoadTimers = async () => {
    // if (user.new) {
    //   await postTwoNewTimers();
    // }
    const response = await getMultiTimers(user._id);
    await setTimers(response.data);
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
 
  const handleAddTimer = async () => {
    await postTimer({ 
      userId: user._id,
      currentTime: 0, 
      intervalNum: null,
      timerRunning: false,
      timerHours: "00",
      timerMinutes: "00",
      timerSeconds: "00",
      isPomodoro: false
    });
    handleLoadTimers();
  };
    
  const renderTimersFromState = () => {
  return timers.map(timer => <Timer userId={user._id} data={timer} key={uuid()} id={timer._id} reload={handleLoadTimers}/>);
  };

  return (
      <div id="multi-wrapper">
          <div className="add-timer-button" onClick={handleAddTimer}>add a timer</div>
          <div className="timers-container">
            {renderTimersFromState()}
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