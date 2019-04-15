import React, {useState, useContext} from 'react';
import {AuthContext} from '../../shared/Auth';
import {signIn} from '../../../services/auth';
import {Link} from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {setCurrentUser} = useContext(AuthContext);

    const login = async (e) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password
        };

        const response = await signIn(data);
        setCurrentUser(response.data);
    }
    
    return (
        <div className="login-page">
            <h2>login</h2>
            <form id="login-form">
                <label name="login-email">
                    email
                    <input required type="text"
                       placeholder={"Your email..."}
                       onChange={({target}) => setEmail(target.value)} 
                    />
                </label>
                
                <label name="login-pass">
                    password
                    <input required type="text"
                        placeholder={"Your password..."}
                        id="login-pass"
                        onChange={({target}) => setPassword(target.value)} />
                </label>
                <input className="submit-button" type="submit" onSubmit={login} value="login" />
                <p>don't have an account? <Link to={'/register'}>register</Link></p>
            </form>
        </div>
    );
};

export default Login;