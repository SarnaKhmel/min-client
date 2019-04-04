import React, {useState, useContext} from 'react';
import { AuthContext } from '../../shared/Auth';
import {signIn} from '../../../services/auth';
import {Link} from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {user, setCurrentUser} = useContext(AuthContext);

    const login = async (e) => {
        e.preventDefault();
        const response = await signIn({email, password});
        // await setCurrentUser(response);
        console.log(response);
    }

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form>
                <input type="text"
                       placeholder={"Your email..."}
                       onChange={({target}) => setEmail(target.value)} />
                <input type="text"
                       placeholder={"Your password..."}
                       onChange={({target}) => setPassword(target.value)} />
                <button onClick={login}>Login</button>
                <p>don't have an account? <Link to={'/register'}>register</Link></p>
            </form>
        </div>
    );
};

export default Login;