import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {signUp} from '../../../services/auth';

import {AuthContext} from '../../shared/Auth';
import {useForm} from '../../../hooks/useForm';

const Register = () => {
    const { formData, updateField } = useForm();

    const {user, setCurrentUser} = useContext(AuthContext);

    const register = async (e) => {
        e.preventDefault();

        const response = await signUp(formData);
        
        setCurrentUser(response.data);
    };

    return (
        <div id="register-page">
            <h1>Register</h1>
            <form>
                <input type="text"
                       placeholder={"Your full name..."}
                       name="name"
                       onChange={updateField}
                />
                <input type="text"
                       placeholder={"Your email..."}
                       name="email"
                       onChange={updateField}
                />
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
                <button onClick={register}>Register</button>
                <p>Have an account? <Link to={"/login"}>login</Link></p>
            </form>
        </div>
    );
};

export default Register;