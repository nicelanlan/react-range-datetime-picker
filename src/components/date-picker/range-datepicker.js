import React from 'react';
import DatePicker from './date-picker';

const PREFIX_CLASSNAME = 'react-datepicker';
export default class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endPickerOpen: false,
      startDate: new Date(),
      endDate: new Date(),
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

  onClickOutside = () => {
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
          timeFormat="HH:MM"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="HH:MM dd/mm/yyyy"
          afterSelected={this.afterStartPickerSelected}
          injectTimes={[
            new Date(injectTime1),
            new Date(injectTime2),
          ]}
          // minDate={new Date()}
          // maxDate={addMonths(new Date(), 5)}
          showDisabledMonthNavigation
        />
        -&nbsp;
        <DatePicker
          startOpen={this.state.endPickerOpen}
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd}
          onClickOutside={this.onClickOutside}
          showTimeSelect
          timeFormat="HH:MM"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="HH:MM dd/mm/yyyy"
          afterSelected={this.afterEndPickerSelected}
          minDate={this.state.startDate}
          showDisabledMonthNavigation
        />
        <hr className={`${PREFIX_CLASSNAME}-range-line`} />
      </div>
    );
  }
}
