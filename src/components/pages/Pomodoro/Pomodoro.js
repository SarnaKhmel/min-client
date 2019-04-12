import React from 'react';
import Timer from '../../shared/Timer/Timer';
import './Pomodoro.css';

const Pomodoro = () => {
    return (
        <div id="pomodoro">
            <Timer isPomodoro={true} />
        </div>
    )
};

export default Pomodoro;