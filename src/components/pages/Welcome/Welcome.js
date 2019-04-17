import React from 'react';
import {Link} from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    return (
        <div id="welcome" className="flex-column">
            <div id="welcome-title" className="flex-column">
                <h2>welcome</h2>
                <h5>min is a timer app with two modes:</h5>
            </div>   
            <div id="welcome-options">
                <div className="welcome-option">
                    <Link to={'/multitimer'}>
                        <button className="welcome-button">multi-timer</button>
                    </Link>
                </div>
                <div className="welcome-option">
                    <Link to={'/pomodoro'}>
                    <button className="welcome-button">pomodoro</button>
                    </Link>
                </div>
            </div>  
        </div>
    );
};

export default Welcome;