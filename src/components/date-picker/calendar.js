import Month from './month';
import Time from './time';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CalendarContainer from './calendar_container';
import {
  now,
  addMonths,
  subtractMonths,
  getStartOfWeek,
  addDays,
  cloneDate,
  formatDate,
  localizeDate,
  isBefore,
  isAfter,
  getLocaleData,
  getFormattedWeekdayInLocale,
  getWeekdayShortInLocale,
  getWeekdayMinInLocale,
  isSameDay,
  allDaysDisabledBefore,
  allDaysDisabledAfter,
  getEffectiveMinDate,
  getEffectiveMaxDate
} from './date_utils';

const PREFIX_CLASSNAME = 'react-datepicker';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.localizeDate(this.getDateInView()),
      selectingDate: null,
      monthContainer: this.monthContainer
    };
  }

  componentDidMount() {
    // monthContainer height is needed in time component
    // to determine the height for the ul in the time component
    // setState here so height is given after final component
    // layout is rendered
    if (this.props.showTimeSelect) {
      this.assignMonthContainer = (() => {
        this.setState({ monthContainer: this.monthContainer });
      })();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.preSelection &&
      !isSameDay(this.props.preSelection, prevProps.preSelection)
    ) {
      this.setState({
        date: this.localizeDate(this.props.preSelection)
      });
    } else if (
      this.props.openToDate &&
      !isSameDay(this.props.openToDate, prevProps.openToDate)
    ) {
      this.setState({
        date: this.localizeDate(this.props.openToDate)
      });
    }
  }

  getDateInView = () => {
    const { preSelection, selected, openToDate, utcOffset } = this.props;
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const current = now(utcOffset);
    const initialDate = openToDate || selected || preSelection;
    if (initialDate) {
      return initialDate;
    } else {
      if (minDate && isBefore(current, minDate)) {
        return minDate;
      } else if (maxDate && isAfter(current, maxDate)) {
        return maxDate;
      }
    }
    return current;
  };

  localizeDate = date => localizeDate(date, this.props.locale);

  increaseMonth = () => {
    this.setState(
      {
        date: addMonths(cloneDate(this.state.date), 1)
      },
      () => this.handleMonthChange(this.state.date)
    );
  };

  decreaseMonth = () => {
    this.setState(
      {
        date: subtractMonths(cloneDate(this.state.date), 1)
      },
      () => this.handleMonthChange(this.state.date)
    );
  };

  handleDayClick = (day, event) => this.props.onSelect(day, event);

  handleDayMouseEnter = day => this.setState({ selectingDate: day });

  handleMonthMouseLeave = () => this.setState({ selectingDate: null });

  handleYearChange = date => {
    if (this.props.onYearChange) {
      this.props.onYearChange(date);
    }
  };

  handleMonthChange = date => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
    }
    if (this.props.adjustDateOnChange) {
      if (this.props.onSelect) {
        this.props.onSelect(date);
      }
      if (this.props.setOpen) {
        this.props.setOpen(true);
      }
    }
  };

  header = (date = this.state.date) => {
    const startOfWeek = getStartOfWeek(cloneDate(date));
    const dayNames = [];
    return dayNames.concat(
      [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const day = addDays(cloneDate(startOfWeek), offset);
        const localeData = getLocaleData(day);
        const weekDayName = this.formatWeekday(localeData, day);

        return (
          <div key={offset} className={`${PREFIX_CLASSNAME}__day-name`}>
            {weekDayName}
          </div>
        );
      })
    );
  };

  formatWeekday = (localeData, day) => {
    if (this.props.formatWeekDay) {
      return getFormattedWeekdayInLocale(
        localeData,
        day,
        this.props.formatWeekDay
      );
    }
    return this.props.useWeekdaysShort
      ? getWeekdayShortInLocale(localeData, day)
      : getWeekdayMinInLocale(localeData, day);
  };

  renderPreviousMonthButton = () => {
    const allPrevDaysDisabled = allDaysDisabledBefore(
      this.state.date,
      'month',
      this.props
    );

    if (
      (!this.props.forceShowMonthNavigation &&
        !this.props.showDisabledMonthNavigation &&
        allPrevDaysDisabled)) {
      return;
    }

    const classes = [
      `${PREFIX_CLASSNAME}__navigation`,
      `${PREFIX_CLASSNAME}__navigation--previous`
    ];

    let clickHandler = this.decreaseMonth;

    if (allPrevDaysDisabled && this.props.showDisabledMonthNavigation) {
      classes.push(`${PREFIX_CLASSNAME}__navigation--previous--disabled`);
      clickHandler = null;
    }

    return (
      <button
        type="button"
        className={classes.join(' ')}
        onClick={clickHandler}
      />
    );
  };

  renderNextMonthButton = () => {
    const allNextDaysDisabled = allDaysDisabledAfter(
      this.state.date,
      'month',
      this.props
    );

    if (
      (!this.props.forceShowMonthNavigation &&
        !this.props.showDisabledMonthNavigation &&
        allNextDaysDisabled)) {
      return;
    }

    const classes = [
      `${PREFIX_CLASSNAME}__navigation`,
      `${PREFIX_CLASSNAME}__navigation--next`
    ];
    if (this.props.showTimeSelect) {
      classes.push(`${PREFIX_CLASSNAME}__navigation--next--with-time`);
    }

    let clickHandler = this.increaseMonth;

    if (allNextDaysDisabled && this.props.showDisabledMonthNavigation) {
      classes.push(`${PREFIX_CLASSNAME}__navigation--next--disabled`);
      clickHandler = null;
    }

    return (
      <button
        type="button"
        className={classes.join(' ')}
        onClick={clickHandler}
      />
    );
  };

  renderCurrentMonth = (date = this.state.date) => {
    return (
      <div className={`${PREFIX_CLASSNAME}__current-month`}>
        {formatDate(date, this.props.dateFormat)}
      </div>
    );
  };

  renderMonths = () => {
    var monthList = [];
    for (var i = 0; i < this.props.monthsShown; ++i) {
      var monthDate = addMonths(cloneDate(this.state.date), i);
      var monthKey = `month-${i}`;
      monthList.push(
        <div
          key={monthKey}
          ref={div => {
            this.monthContainer = div;
          }}
          className={`${PREFIX_CLASSNAME}__month-container`}
        >
          <div className={`${PREFIX_CLASSNAME}__header`}>
            {this.renderCurrentMonth(monthDate)}
            <div className={`${PREFIX_CLASSNAME}__day-names`}>
              {this.header(monthDate)}
            </div>
          </div>
          <Month
            day={monthDate}
            dayClassName={this.props.dayClassName}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
            onMouseLeave={this.handleMonthMouseLeave}
            onWeekSelect={this.props.onWeekSelect}
            formatWeekNumber={this.props.formatWeekNumber}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            excludeDates={this.props.excludeDates}
            highlightDates={this.props.highlightDates}
            selectingDate={this.state.selectingDate}
            includeDates={this.props.includeDates}
            inline={this.props.inline}
            fixedHeight={this.props.fixedHeight}
            filterDate={this.props.filterDate}
            preSelection={this.props.preSelection}
            selected={this.props.selected}
            selectsStart={this.props.selectsStart}
            selectsEnd={this.props.selectsEnd}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            peekNextMonth={this.props.peekNextMonth}
            utcOffset={this.props.utcOffset}
          />
        </div>
      );
    }
    return monthList;
  };

  renderTimeSection = () => {
    if (this.props.showTimeSelect) {
      return (
        <Time
          selected={this.props.selected}
          onChange={this.props.onTimeChange}
          format={this.props.timeFormat}
          includeTimes={this.props.includeTimes}
          intervals={this.props.timeIntervals}
          minTime={this.props.minTime}
          maxTime={this.props.maxTime}
          excludeTimes={this.props.excludeTimes}
          timeCaption={this.props.timeCaption}
          monthRef={this.state.monthContainer}
          injectTimes={this.props.injectTimes}
        />
      );
    }
  };

  render() {
    const Container = this.props.container || CalendarContainer;

    return (
      <Container
        className={classnames(PREFIX_CLASSNAME, this.props.className)}
      >
        {this.renderPreviousMonthButton()}
        {this.renderNextMonthButton()}
        {this.renderMonths()}
        {this.renderTimeSection()}
        {this.props.children}
      </Container>
    );
  }
}

Calendar.propTypes = {
  adjustDateOnChange: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  container: PropTypes.func,
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    .isRequired,
  dayClassName: PropTypes.func,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  fixedHeight: PropTypes.bool,
  formatWeekNumber: PropTypes.func,
  highlightDates: PropTypes.instanceOf(Map),
  includeDates: PropTypes.array,
  includeTimes: PropTypes.array,
  injectTimes: PropTypes.array,
  inline: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  monthsShown: PropTypes.number,
  // onClickOutside: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func,
  onYearChange: PropTypes.func,
  forceShowMonthNavigation: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onWeekSelect: PropTypes.func,
  showTimeSelect: PropTypes.bool,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  onTimeChange: PropTypes.func,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  excludeTimes: PropTypes.array,
  timeCaption: PropTypes.string,
  openToDate: PropTypes.object,
  peekNextMonth: PropTypes.bool,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  startDate: PropTypes.object,
  useWeekdaysShort: PropTypes.bool,
  formatWeekDay: PropTypes.func,
  utcOffset: PropTypes.number,
  weekLabel: PropTypes.string,
  setOpen: PropTypes.func,
  showDisabledMonthNavigation: PropTypes.bool
};

Calendar.defaultProps = {
  monthsShown: 1,
  forceShowMonthNavigation: false,
  timeCaption: 'Time'
};