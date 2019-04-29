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
    getTimersFromDB();
  }, []);

  const getTimersFromDB = async () => {
    const response = await getMultiTimers(user._id);
    await setTimers(response.data);
  };
 
  const handleAddTimer = async () => {
    await postTimer({ 
      userId: user._id,
      currentTime: 0, 
      intervalNumber: null,
      timerRunning: false,
      hours: "",
      minutes: "",
      seconds: "",
      isPomodoro: false
    });
    getTimersFromDB();
  };
    
  const renderTimersFromState = () => {
    if (!timers) {
      return "loading..."
    }

    return timers.map(timer => <Timer userId={user._id} data={timer} key={uuid()} id={timer._id} reload={getTimersFromDB}/>);
  
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