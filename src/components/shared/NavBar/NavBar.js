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
        if (user) return <div className="button" onClick={handleLogout}>logout</div>
        else return <Link to={'/login'}>login</Link>
    }

    return (
        <div id="navbar">
            <div className="nav-box"></div>
            <div className="nav-box"><h1>min</h1></div>
            <div className="nav-box">
                <div id="nav-box-right">
                    <div id="nav-box-right-buttons">
                    {renderLoginLogout()}
                    <Link to={'/register'}>register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;