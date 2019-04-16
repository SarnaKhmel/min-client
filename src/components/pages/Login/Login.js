import React, {useState, useContext} from 'react';
import {AuthContext} from '../../shared/Auth';
import {signIn} from '../../../services/auth';
import {Link} from 'react-router-dom';
import './Login.css';
import Form from '../../shared/Form/Form';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {setCurrentUser} = useContext(AuthContext);

    const login = async () => {
        const data = {
            email: email,
            password: password
        };

        const response = await signIn(data);
        setCurrentUser(response.data);
    };
    
    return (
        <div className="login-page">
            <h2>login</h2>
            <Form id="login-form" submit={login}>
                <div className={"form-group"}> 
                    <label htmlFor={"email"}>
                        email
                    </label>
                    <input 
                    id={"email"}
                    type={"email"}
                    className={"form-control"}
                    placeholder={"Your email..."}
                    onChange={({target}) => setEmail(target.value)} 
                    required={true}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className={"form-group"}>     
                    <label htmlFor={"password"}>
                        password
                    </label>
                    <input 
                        className={"form-control"}
                        id={"password"}
                        name={"password"}
                        type={"password"}
                        placeholder={"Your password..."}
                        minLength={5}
                        maxLength={255}
                        required={true}
                        onChange={({target}) => setPassword(target.value)} 
                        />
                    <div className="invalid-feedback"></div>
                </div>
                <button className={"submit-button"} type="submit">login</button>
            </Form>
            <p>don't have an account? <Link to={'/register'}>register</Link></p>
        </div>
    );
};

export default Login;