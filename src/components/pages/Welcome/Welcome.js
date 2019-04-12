import React from 'react';
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
                </div>
                <div className="welcome-option">
                </div>
            </div>  
        </div>
    );
};

export default Welcome;