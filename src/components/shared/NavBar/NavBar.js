import React, {useContext} from 'react';
import {AuthContext} from '../../shared/Auth';
import './NavBar.css';
import {LOCAL_STORAGE_KEY} from '../Auth';


const NavBar = (props) => {
    const {setCurrentAuthToken} = useContext(AuthContext);

    const handleLogout = async () => {
        await setCurrentAuthToken(null);
    };

    return (
        <div id="navbar">
            <div id="nav-left"></div>
            <div id="nav-middle"><h1>min</h1></div>
            <div id="nav-right"><button onClick={handleLogout}>logout</button></div>
        </div>
    )
}

export default NavBar;