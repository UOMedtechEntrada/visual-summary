import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllData, getRotationSchedules } from '../../utils/requestServer';
import _ from 'lodash';
import ReactSelect from 'react-select';
import ProgramAllYearsSummary from '../ProgramEvaluationGroup/ProgramAllYearsSummary';
import ProgramBasePanel from '../ProgramEvaluationGroup/ProgramBasePanel';
import moment from 'moment';
import downloadCSV from '../../utils/downloadCSV';
import { possibleAcademicYears } from '../../utils/getAcademicYears';
import { withTranslation } from "react-i18next";
class ProgramDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaderVisible: false,
            // list of all resident records
            allResidentRecords: [],
            academicYears: possibleAcademicYears.slice(1)
        };
        this._isMounted = false;
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSelectAcademicYear = (academicYears) => {
        const sortedYears = _.sortBy(academicYears, d => d.label);
        this.setState({ 'academicYears': sortedYears, allResidentRecords: [] })
    };

    async onSubmit() {
        const { academicYears } = this.state;
        const yearList = _.map(academicYears, d => d.value);

        if (yearList.length > 0) {
            // turn loader on
            this.setState({ isLoaderVisible: true });

            Promise.all(yearList.map((y) => getAllData('program', y)))
                .then((year_data_list) => {

                    // merge data from different years into a single list 
                    const allRecords = _.flatMap(year_data_list, d => d.allResidentRecords),
                        residentList = _.uniq(_.flatMap(year_data_list, d => d.residentList)),
                        courseName = year_data_list.length > 0 ? year_data_list[0].courseName : '';

                    return getRotationSchedules(residentList, allRecords, courseName);
                })
                .then((allResidentRecords) => {
                    // set the values on the state 
                    this._isMounted && this.setState({ allResidentRecords, isLoaderVisible: false });
                })
                .catch(() => {
                    this._isMounted && this.setState({ isLoaderVisible: false, allResidentRecords: [] });
                    console.log("error in fetching all resident records");
                });
        }
    }


    componentDidMount() { this._isMounted = true }
    componentWillUnmount() { this._isMounted = false }

    downloadReport = () => {

        const { allResidentRecords = [] } = this.state, { t } = this.props;

        if (allResidentRecords.length > 0) {
            downloadCSV([
                'Academic Year',
                'Encounter Date',
                'Expiry Date',
                'Triggered_Date',
                'Completion_Date',
                'Learner',
                'Assessor',
                'Assessor Role',
                'EPA',
                'Rating',
                'Feedback',
                'Type',
                'Progress',
                'Triggered_By',
                'Assessment_Method',
            ]
                , _.map(allResidentRecords, e =>
                ([e['Academic_Year'] || '',
                e['Date'] || '',
                moment(e.Expiry_Date, 'MMM DD, YYYY').format('YYYY-MM-DD'),
                e['Triggered_Date'] ? moment(e['Triggered_Date'], 'MMM DD, YYYY').format('YYYY-MM-DD') : '',
                e['Completion_Date'] ? moment(e['Completion_Date'], 'MMM DD, YYYY').format('YYYY-MM-DD') : '',
                e['Resident_Name'] || '',
                e['Assessor_Name'] || '',
                e['Assessor_Role'] || '',
                e['EPA'],
                e['Rating'] || '',
                e['Feedback'] || '',
                e['Type'] || '',
                e['isExpired'] ? 'expired' : e['progress'],
                e['Triggered_By'] || '',
                e['Assessment_Method'] || ''
                ])),
                'program-data-report');
        }

    }


    render() {

        const { academicYears, allResidentRecords = [] } = this.state,
            { t } = this.props,
            fullWidth = document.body.getBoundingClientRect().width - 300;

        return (
            <div className='dashboard-root-program m-b-lg' >
                <div className='custom-select-wrapper'>
                    <div className='multi-selection-box m-r'>
                        <h2 className='header'>{t("Academic Year")}</h2>
                        <div className='react-select-root'>
                            <ReactSelect
                                isMulti={true}
                                value={academicYears}
                                options={possibleAcademicYears}
                                styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                                onChange={this.onSelectAcademicYear} />
                        </div>
                    </div>
                    <button type="submit" className="filter-button btn btn-primary-outline m-r" onClick={this.onSubmit}>
                        {t("GET RECORDS")}
                    </button>
                </div>
                {this.state.isLoaderVisible ?
                    <div className='text-center'>
                        <i className='fa fa-spinner fa-5x fa-spin m-t-lg' aria-hidden="true"></i>
                    </div> :
                    <div className='container-fluid'>
                        {allResidentRecords.length > 0 &&
                            <div>
                                <div className='text-right m-r-md m-t-md'>
                                    <button onClick={this.downloadReport} className='btn btn btn-primary-outline'> <i className="fa fa-download"></i>
                                        {" " + t("Export Program Data")}
                                    </button>
                                </div>
                                <ProgramAllYearsSummary
                                    width={fullWidth}
                                    allRecords={allResidentRecords}
                                    possibleAcademicYears={_.reverse(academicYears)} />
                                <ProgramBasePanel
                                    isUG={this.props.isUG}
                                    width={fullWidth}
                                    allRecords={allResidentRecords}
                                    possibleAcademicYears={_.reverse(academicYears)} />
                            </div>}
                    </div>}
            </div >
        );
    }
}


function mapStateToProps(state) {
    return {
        isUG: state.oracle.isUG
    };
}

export default withTranslation()(connect(mapStateToProps, {})(ProgramDashboard));