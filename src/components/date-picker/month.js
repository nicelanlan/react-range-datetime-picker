import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Week from './week';
import {
  addDays,
  addWeeks,
  cloneDate,
  getMonth,
  getStartOfWeek,
  getStartOfMonth,
  isSameMonth,
} from './date-utils';

const PREFIX_CLASSNAME = 'react-datepicker__month';

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

export default class Month extends React.Component {
  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  handleDayMouseEnter = day => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day);
    }
  };

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave();
    }
  };

  isWeekInMonth = startOfWeek => {
    const day = this.props.day;
    const endOfWeek = addDays(cloneDate(startOfWeek), 6);
    return (
      isSameMonth(startOfWeek, day) || isSameMonth(endOfWeek, day)
    );
  };

  renderWeeks = () => {
    const weeks = [];
    var isFixedHeight = this.props.fixedHeight;
    let currentWeekStart = getStartOfWeek(
      getStartOfMonth(cloneDate(this.props.day))
    );
    let i = 0;
    let breakAfterNextPush = false;

    while (true) {
      weeks.push(
        <Week
          key={i}
          day={currentWeekStart}
          month={getMonth(this.props.day)}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          onWeekSelect={this.props.onWeekSelect}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          excludeDates={this.props.excludeDates}
          includeDates={this.props.includeDates}
          inline={this.props.inline}
          highlightDates={this.props.highlightDates}
          selectingDate={this.props.selectingDate}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
          selectsStart={this.props.selectsStart}
          selectsEnd={this.props.selectsEnd}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          dayClassName={this.props.dayClassName}
          utcOffset={this.props.utcOffset}
        />
      );

      if (breakAfterNextPush) break;

      i++;
      currentWeekStart = addWeeks(cloneDate(currentWeekStart), 1);

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek =
        isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
      const isNonFixedAndOutOfMonth =
        !isFixedHeight && !this.isWeekInMonth(currentWeekStart);

      if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true;
        } else {
          break;
        }
      }
    }

    return weeks;
  };

  getClassNames = () => {
    const { selectingDate, selectsStart, selectsEnd } = this.props;
    return classnames(PREFIX_CLASSNAME, {
      [`${PREFIX_CLASSNAME}--selecting-range`]:
        selectingDate && (selectsStart || selectsEnd)
    });
  };

  render() {
    return (
      <div
        className={this.getClassNames()}
        onMouseLeave={this.handleMouseLeave}
        role="listbox"
      >
        {this.renderWeeks()}
      </div>
    );
  }
}

Month.propTypes = {
  day: PropTypes.object.isRequired,
  dayClassName: PropTypes.func,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  fixedHeight: PropTypes.bool,
  highlightDates: PropTypes.instanceOf(Map),
  includeDates: PropTypes.array,
  inline: PropTypes.bool,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onWeekSelect: PropTypes.func,
  peekNextMonth: PropTypes.bool,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
};
