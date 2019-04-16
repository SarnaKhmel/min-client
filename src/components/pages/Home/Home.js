import React from 'react';
import './Home.css';
import {Link} from 'react-router-dom'

const Home = (props) => {
    return (
        <div id="home-page">
            <div id="home-greeting">
                <h2>welcome to min</h2>
            </div>
            <div className="button-wrapper">
                <Link to={'/login'}>login</Link>
                <Link to={'/register'}>register</Link>
            </div>
        </div>    
    );
};

export default Home;