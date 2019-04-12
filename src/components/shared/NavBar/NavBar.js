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
            <div className="button" onClick={handleLogout}>logout</div>
            )
        }
        else {
            return (
            <div id="nav-box-right-buttons">
                <Link to={'/login'}>login</Link>
                <Link to={'/register'}>register</Link>
            </div>
            )
        }
    }

    return (
        <div id="navbar">
            <div className="nav-box"></div>
            <div className="nav-box" id="nav-logo"><Link to={'/home'}><h1>min</h1></Link></div>
            <div className="nav-box">
                <div id="nav-box-right">
                    <div id="nav-box-right-buttons">
                        {renderLoginLogout()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;