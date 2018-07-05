import React from 'react';
import DatePicker from './date-picker';
import moment from 'moment';

const PREFIX_CLASSNAME = 'react-datepicker';
export default class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endPickerOpen: false,
      startDate: moment(),
      endDate: moment(),
    };
  }

  handleChangeStart = date => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeEnd = date => {
    this.setState({
      endDate: date,
    });
  };

  afterStartPickerSelected= () => {
    this.setState({
      endPickerOpen: true,
    });
  }

  afterEndPickerSelected= () => {
    this.setState({
      endPickerOpen: false,
    });
  }

  render() {
    const dateNow = new Date();
    const injectTime1 = new Date(dateNow.setHours(0));
    injectTime1.setMinutes(3);
    const injectTime2 = new Date(dateNow.setHours(3));
    injectTime2.setMinutes(20);
    return (
      <div className={`${PREFIX_CLASSNAME}-range`}>
        <DatePicker
          selected={this.state.startDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeStart}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="LLL"
          afterSelected={this.afterStartPickerSelected}
          // injectTimes={[
          //   new Date(injectTime1),
          //   new Date(injectTime2),
          // ]}
          injectTimes={[
            moment().hours(0).minutes(1)
          ]}
        />
        -&nbsp;
        <DatePicker
          startOpen={this.state.endPickerOpen}
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="LLL"
          afterSelected={this.afterEndPickerSelected}
        />
        <hr className={`${PREFIX_CLASSNAME}-range-line`} />
      </div>
    );
  }
}
