import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Form.css';

class Form extends Component {
    state = {
        isValidated: false
    };

    validate = () => {
        const formLength = this.formEl.length;

        if (this.formEl.checkValidity() === false) {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem.parentNode.querySelector('.invalid-feedback');
                errorLabel.style.backgroundColor = "#ff544f";
                if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                    if (!elem.validity.valid) {
                        if (elem.type === "name")
                        errorLabel.textContent = "name must be at least 5 characters";
                        if (elem.type === "email")
                        errorLabel.textContent = "please enter a valid email address";
                        else if (elem.type === "password")
                        errorLabel.textContent = "please enter a valid password";
                    } else {
                        errorLabel.textContent = '';
                    }
                }
            }

            return false;
        } else {
            for (let i = 0; i < formLength; i++) {
                const elem = this.formEl[i];
                const errorLabel = elem.parentNode.querySelector('.invalid-feedback');
                errorLabel.style.backgroundColor = "none";
                if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                    errorLabel.textContent = '';
                }
            }

            return true;
        }
    };

    submitHandler = (event) => {
        event.preventDefault();

        if (this.validate()) {
            this.props.submit();
        }

        this.setState({ isValidated: true });
    }

    render () {
        let props;
        if (Array.isArray(this.props)) {
            props = [...this.props];
        } else {
            props = this.props;
        }
        
        let classNames = [];

        if (props.className) {
            classNames = [...props.className];
            delete props.className;
        }

        if (this.state.isValidated) {
            classNames.push('.was-validated');
        }

        return (
            <form ref={ form => this.formEl = form } onSubmit={this.submitHandler} {...props} className={classNames} noValidate>
                {this.props.children}
            </form>
        );
    }
};

Form.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    submit: PropTypes.func.isRequired
};

export default Form;