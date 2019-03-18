import React from 'react';
import { connect } from 'react-redux';

const WrappedComponent = (Component) => {
    const HOC = (props) => {
        if (props.test) {
            return <Component />;
        } else {
            return <p>You don't have your test prop!</p>
        }
    }
    return connect(mapStateToProps)(HOC);
};

const mapStateToProps = (state) => {
    return {
        test: state.test
    }
};

export default WrappedComponent;