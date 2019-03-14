import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


const WithTest = (Component) => {
    const WrappedComponent = (props) => {    
        if (props.test) {
            return <Component /> 
        } else {
            return <h5>please set test</h5>
        }   
    } 
    return connect(mapStateToProps, actions)(WrappedComponent);
}


const mapStateToProps = (state) => {
    return {
        test: state.test
    }
};

export default WithTest;
