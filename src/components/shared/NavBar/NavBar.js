import React, {useContext} from 'react';
import {AuthContext} from '../../shared/Auth';
import './NavBar.css';

const NavBar = (props) => {
    const {setCurrentUser} = useContext(AuthContext);

    const handleLogout = async () => {
        await setCurrentUser(null);
    };

    return (
        <div id="navbar">
            <div id="nav-left"></div>
            <div id="nav-middle"><h1>min</h1></div>
            <div id="nav-right"><div className="button" onClick={handleLogout}>logout</div></div>
        </div>
    )
}

export default NavBar;