import React, { Component } from 'react';
import DatePicker from './components/date-picker';
import { RangeDatePicker } from './components/date-picker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    const dateNow = new Date();
    const injectTime1 = new Date(dateNow.setHours(0));
    injectTime1.setMinutes(3);
    const injectTime2 = new Date(dateNow.setHours(3));
    injectTime2.setMinutes(20);
    return (
      <div className="row">
        <div className="column">
          <p> Date-Picker </p>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            dateFormat="HH:MM dd/mm/yyyy"
            hintText="Select date"
          />
        </div>

        <div className="column">
          <p> Date-Time-Picker </p>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            showTimeSelect
            timeFormat="HH:MM"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="HH:MM dd/mm/yyyy"
            hintText="Select time"
          />
        </div>

        <div className="column">
          <p> Date-Time-Range-Picker </p>
          <RangeDatePicker
            showTimeSelect
            timeFormat="HH:MM"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="HH:MM dd/mm/yyyy"
            hintText="Time range"
            injectTimes={[
              new Date(injectTime1),
              new Date(injectTime2),
            ]}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
