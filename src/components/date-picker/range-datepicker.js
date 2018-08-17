import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from './date-picker';

const PREFIX_CLASSNAME = 'react-datepicker';
export default class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endPickerOpen: false,
      startDate: props.startDate,
      endDate: props.endDate,
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
    const {dateFormat, hintText, minDate, maxDate, showDisabledMonthNavigation, showTimeSelect, timeCaption, timeFormat, injectTimes} = this.props;
    return (
      <div className={`${PREFIX_CLASSNAME}-range`}>
        <DatePicker
          hintText={hintText}
          selected={this.state.startDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          showTimeSelect={showTimeSelect}
          timeFormat={timeFormat}
          timeIntervals={15}
          timeCaption={timeCaption}
          dateFormat={dateFormat}
          injectTimes={injectTimes}
          minDate={minDate}
          maxDate={maxDate}
          showDisabledMonthNavigation={showDisabledMonthNavigation}
          onChange={this.handleChangeStart}
          afterSelected={this.afterStartPickerSelected}
        />
        {this.state.startDate ? ' - ' : ''}
        <DatePicker
          startOpen={this.state.endPickerOpen}
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          showTimeSelect={showTimeSelect}
          timeFormat={timeFormat}
          timeIntervals={15}
          timeCaption={timeCaption}
          dateFormat={dateFormat}
          injectTimes={injectTimes}
          minDate={minDate}
          maxDate={maxDate}
          showDisabledMonthNavigation={showDisabledMonthNavigation}
          onChange={this.handleChangeEnd}
          onClickOutside={this.onClickOutside}
          afterSelected={this.afterEndPickerSelected}
        />
        <hr className={`${PREFIX_CLASSNAME}-range-line`} />
      </div>
    );
  }
}

RangeDatePicker.propTypes = {
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  endDate: PropTypes.object,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func,
  onSelect: PropTypes.func,
  onWeekSelect: PropTypes.func,
  onYearChange: PropTypes.func,
  selected: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showDisabledMonthNavigation: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  startDate: PropTypes.object,
  timeCaption: PropTypes.string,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
};
