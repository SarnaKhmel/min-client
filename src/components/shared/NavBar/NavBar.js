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
            <div id="nav-left"></div>
            <div id="nav-middle"><h1>min</h1></div>
            <div id="nav-right">{renderLoginLogout()}</div>
        </div>
    )
}

export default NavBar;