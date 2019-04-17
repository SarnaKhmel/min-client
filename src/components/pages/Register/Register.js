import React, {useContext} from 'react';
import './Register.css';
import {Link} from 'react-router-dom';
import {signUp} from '../../../services/auth';
import {AuthContext} from '../../shared/Auth';
import {useForm} from '../../../hooks/useForm';
import Form from '../../shared/Form/Form';

const Register = () => {
    const { formData, updateField } = useForm();
    const {setCurrentUser} = useContext(AuthContext);

    // Sends a POST request to /api/v1/users and sets the response to be the current user by using the context method setCurrentUser
    const register = async () => {
        const response = await signUp(formData);
        if (response.response && response.response.data === "A user with this email already exists.") {
            const invalidFeedback = document.getElementById('email-invalid-feedback');
            invalidFeedback.textContent = response.response.data;
            return;
        }
        setCurrentUser(response.data);
    };

    return (
        <div id="register-page">
            <h2>create a new min account</h2>
            <Form id="register-form" submit={register}>
                <div className={"form-group"}>
                    <label htmlFor={"name"}>
                        name
                    </label>
                    <input 
                        type={"text"}
                        className={"form-control"}
                        placeholder={"Your full name..."}
                        name={"name"}
                        minLength={5}
                        maxLength={50}
                        onChange={updateField}
                        required={true}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                
                <div className={"form-group"}>
                    <label htmlFor={"email"}>
                        email
                        </label>
                    <input 
                        type={"email"}
                        className={"form-control"}
                        placeholder={"Your email..."}
                        name={"email"}
                        maxLength={255}
                        onChange={updateField}
                        required={true}
                    />
                    <div id="email-invalid-feedback" className="invalid-feedback"></div>
                </div>
                
                <div className={"form-group"}>
                    <label htmlFor={"password"}>
                        password
                    </label>
                    <input 
                        required={true}
                        type={"password"}
                        className={"form-control"}
                        placeholder={"Your password..."}
                        minLength={5}
                        maxLength={255}
                        name={"password"}
                        onChange={updateField}
                    />
                    <div className="invalid-feedback"></div>
                </div>
                <div className={"form-group"}>
                    <label htmlFor={"password2"}>
                    </label>
                    <input 
                        required={true}
                        type={"password"}
                        className={"form-control"}
                        placeholder={"Verify password..."}
                        minLength={5}
                        maxLength={255}
                        name={"password2"}
                        id={"pass-2"}
                        onChange={updateField}
                    />
                    <div className="invalid-feedback"></div>
                </div> 
                <button className={"submit-button"} type="submit">register</button>
            </Form>
            <p>have an account? <Link to={"/login"}>login</Link></p>
        </div>
    );
};

export default Register;