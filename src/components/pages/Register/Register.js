import React, {useContext} from 'react';
import './Register.css';
import {Link} from 'react-router-dom';
import {signUp} from '../../../services/auth';
import {AuthContext} from '../../shared/Auth';
import {useForm} from '../../../hooks/useForm';

const Register = () => {
    const { formData, updateField } = useForm();

    const {setCurrentUser} = useContext(AuthContext);

    const register = async (e) => {
        e.preventDefault();

        const response = await signUp(formData);
        
        setCurrentUser(response.data);
    };

    return (
        <div id="register-page">
            <h2>register</h2>
            <form id="register-form">
                <label name="name">
                    name
                    <input type="text"
                        placeholder={"Your full name..."}
                        name="name"
                        onChange={updateField}
                    />
                </label>
                <label name="email">
                    email
                    <input type="text"
                        placeholder={"Your email..."}
                        name="email"
                        onChange={updateField}
                    />
                </label>
                <label name="password">
                    password
                    <input type="text"
                        placeholder={"Your password..."}
                        name="password"
                        onChange={updateField}
                    />
                <input type="text"
                       placeholder={"Verify password..."}
                       name="password2"
                       onChange={updateField}
                />
                </label>
                <button onClick={register}>Register</button>
                <p>Have an account? <Link to={"/login"}>login</Link></p>
            </form>
        </div>
    );
};

export default Register;