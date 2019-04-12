import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../shared/Auth';
import './NavBar.css';

const NavBar = (props) => {
    const {user, setCurrentUser} = useContext(AuthContext);

    const handleLogout = async () => {
        await setCurrentUser(null);
    };

    const renderLoginLogout = () => {
        if (user) { 
            return (
                <div className="nav-box-right-buttons logged-in">
                    <div className="button" onClick={handleLogout}>logout</div>
                </div> 
            );
        }
        else {
            return (
            <div className="nav-box-right-buttons">
                <Link to={'/login'}>login</Link>
                <Link to={'/register'}>register</Link>
            </div>
            );
        }
    };

    const renderLeftNavBar = () => {
        if (user) {
            return (
                <div className="nav-box-left-buttons logged-in">
                    <Link to={'/multitimer'}>multi-timer</Link>
                    <Link to={'/pomodoro'}>pomodoro</Link>
                </div>
            );
        } else {
            return;
        }
    }

    return (
        <div id="navbar">
            <div className="nav-box">
                <div id="nav-box-left">
                    <div className="nav-box-left-buttons">
                        {renderLeftNavBar()}
                    </div>
                </div>   
            </div>
            <div className="nav-box" id="nav-logo"><Link to={'/home'}><h1>min</h1></Link></div>
            <div className="nav-box">
                <div id="nav-box-right">
                    <div className="nav-box-right-buttons">
                        {renderLoginLogout()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;