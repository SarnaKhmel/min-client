import React from 'react';
import './Home.css';

const Home = (props) => {
    return (
        <div id="home-page">
            <div id="home-greeting">
                <h4>welcome to min!</h4>
            </div>
            <div className="button-wrapper">
                <div className="home-button">login</div>
                <div className="home-button">create an account</div>
            </div>
        </div>
        
        
    )
};

export default Home;