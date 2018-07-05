import React, { Component } from 'react';
// import DatePicker from './components/date-picker';
import { RangeDatePicker } from './components/date-picker';
import moment from 'moment';
// import './components/date-picker/stylesheets/datepicker.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    return (
      <div className="row">
        {/* <div className="column">
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="LLL"
          />
        </div> */}

        <div className="column">
          <RangeDatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="LLL"
          />
        </div>
      </div>
    );
  }
}

export default App;
