import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export default class DatePicker extends Component {
  constructor (props) {
    super(props);
    this.state = {
      date: props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      date: date
    });
    this.props.onChange(date);
  }

  render() {

    return (
      <div className={"inputhack"} style={{flex: '1 0 auto'}}>
        <ReactDatePicker
          customInput={<input style={{width: '100%'}} />}
          dateFormat="YYYY-MM-DD"
          placeholderText={this.props.placeholder}
          selected={this.state.date}
          onChange={this.handleChange}
          isClearable={true}
        />
      </div>
    );
  }
}
