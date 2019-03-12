import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';

class App extends Component {

  componentDidMount() {
    this.props.setTest("hello");
  }


  render() {
    console.log(this.props.test)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    test: state.test
  }
}

export default connect(mapStateToProps, actions)(App);
