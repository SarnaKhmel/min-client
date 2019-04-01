import React from 'react';
import './Home.css';
import {Link} from 'react-router-dom'

const Home = (props) => {
    return (
        <div id="home-page">
            <div id="home-greeting">
                <h4>welcome to min!</h4>
            </div>
            <div className="button-wrapper">
                <Link to={'/login'}>Login</Link>
                <Link to={'/register'}>Register</Link>
            </div>
        </div>    
    )
};

export default Home;