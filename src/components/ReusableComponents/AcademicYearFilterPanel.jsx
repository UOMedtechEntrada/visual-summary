import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { withTranslation } from "react-i18next";
import { getAcademicYearStartDate, getAcademicYearEndDate } from '../../utils/getAcademicYears';
class AcademicYearFilterPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { onDatesChange, startDate, endDate, academicYear, tooltipRef, tooltipID, t } = this.props;

        const minDate = getAcademicYearStartDate(academicYear.value);
        const maxDate = getAcademicYearEndDate(academicYear.value);
        return (
            <div className='filter-panel academic-year-filter no-printing'>
                <div className='text-xs-left advanced-filter-box normative-filter-box'>
                    <div className='react-select-root'>
                        <label className='filter-label'>{t("Date Range")}</label>
                        <DateRangePicker
                            startDatePlaceholderText={t("Start Date")}
                            endDatePlaceholderText={t("End Date")}
                            hideKeyboardShortcutsPanel={true}
                            isOutsideRange={() => false}
                            startDate={startDate ?? moment(minDate)}
                            startDateId="academic_year_filter_unique_start_date_id"
                            endDate={endDate}
                            endDateId="academic_year_filter_unique_end_date_id"
                            minDate={moment(minDate)}
                            maxDate={moment(maxDate)}
                            onDatesChange={onDatesChange}
                            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                        />
                    </div>
                    
                </div>
            </div>)
    }

}

export default withTranslation()(AcademicYearFilterPanel);