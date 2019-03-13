import React, { Component } from 'react';
import Picker from 'react-mobile-picker';


export default class PickerWheel extends Component {
    state = {
        valueGroups: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        optionGroups: {
            hours: this.generateNumberArray(24),
            minutes: this.generateNumberArray(60),
            seconds: this.generateNumberArray(60)
        }
    }

    generateNumberArray(length) {
        const output = [];

        for (let i = 0; i < length; i++) {
            output.push(i);
        }

        return output;
    }

    handleChange = (name, value) => {
        this.setState(({valueGroups}) => ({
            valueGroups: {
                ...valueGroups,
                [name]: value
            }
        }));
    };

  render() {
      const { optionGroups, valueGroups } = this.state;
    return (
      <Picker optionGroups={optionGroups} valueGroups={valueGroups} onChange={this.handleChange} />
    );
  }
}
