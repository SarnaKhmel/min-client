import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

 
class TestButton extends Component {

    handleClick = () => {
        if (this.props.test) {
            this.props.setTest("")
        } else {
            this.props.setTest("with test!")
        }    
    }

  render() {
    return (
      <div className="test-button" onClick={this.handleClick}>
        set test
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        test: state.test
    }
}

export default connect(mapStateToProps, actions)(TestButton);

