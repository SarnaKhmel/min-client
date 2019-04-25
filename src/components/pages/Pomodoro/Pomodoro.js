import React, { useContext, useEffect, useState } from 'react';
import Timer from '../../shared/Timer/Timer';
import './Pomodoro.css';
import {AuthContext} from '../../shared/Auth';
import {postTimer, getPomodoro} from '../../../services/timers';

const Pomodoro = () => {

    const {user} = useContext(AuthContext);
    const [pomodoro, setPomodoro] = useState(null);

    useEffect(() => {
    handleLoadPomodoro();
      }, []);
    
    const handleLoadPomodoro = async () => {
        const response = await getPomodoro(user._id);
        if (response.data === {}) {
            const newPomodoro = await postTimer({
                userId: user._id,
                name: "",
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
                isPomodoro: true,
                breakMinutes: "",
                isBreak: false,
                isLongBreak: false,
                pomCount: 0
                });
                await setPomodoro(newPomodoro);
                return;
        } else {  
            await setPomodoro(response.data);
        }
    };
    
    const renderPomodoro = () => {
        return pomodoro ? <Timer data={pomodoro}/> : null;
    }

    return (
        <div id="pomodoro">
            {renderPomodoro()}
        </div>
    )
};

export default Pomodoro;