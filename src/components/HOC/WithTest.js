import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


const WithTest = (Component) => {
    const WrappedComponent = (props) => {
        console.log('WithTest props', props);
        if (props.test) {
            return <Component /> 
        } else {
            return <h1>please set test</h1>
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
