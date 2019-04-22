import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Welcome from './pages/Welcome/Welcome';
import NavBar from './shared/NavBar/NavBar';
import Multitimer from './pages/Multitimer/Multitimer';
import Pomodoro from './pages/Pomodoro/Pomodoro';
import {Redirect, Route, Switch} from 'react-router-dom';

const routes = currentUser => {
    
    // Routes viewable without login
    if (!currentUser) {
        return (
            <>
                <NavBar/>
                <Switch>
                    <Route path="/home" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Redirect from="*" to="/home" />
                </Switch>
            </>
        );
    }

    return (
        <>
            <NavBar/>
            <Switch>
                <Route path ="/welcome" component={Welcome}/>
                <Route path ="/multitimer" component={Multitimer}/>
                <Route path ="/pomodoro" component={Pomodoro}/>
                <Redirect from="*" to="/welcome" />
            </Switch>
        </>
    );
}

export default routes;