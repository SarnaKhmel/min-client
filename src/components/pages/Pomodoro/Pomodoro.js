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
                timerLength: 0,
                currentTime: 0,
                shortBreakLength: 0,
                shortBreakTime: 0,
                longBreakLength: 0,
                longBreakTime: 0,
                longBreakMinutes: "",
                intervalNumber: null,
                timerRunning: false,
                hours: "",
                minutes: "",
                seconds: "",
                isPomodoro: true,
                shortBreakMinutes: "",
                isShortBreak: false,
                isLongBreak: false,
                pomodoroCounter: 0
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