import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getAllData } from '../../utils/requestServer';
import ReactSelect from 'react-select';
import processFacultyMap from '../../utils/processors/processFacultyMap';
import {
    FacultyFilterPanel, FacultyInfoGroup,
    FacultyRecordTable, FacultyGraphGroup, FacultyExpiredRecordTable
} from '../';
import { currentAcademicYear, possibleAcademicYears } from '../../utils/getAcademicYears';
import {
    setFacultyDashboardLoaderState, setFacultyAcademicYear, setFacultyResidentRecords, setFacultyList, setFacultyGroupList, setFacultyDepartmentList,
    setFacultyCourse, setFacultyFilter
} from '../../redux/actions/actions';
import downloadCSV from '../../utils/downloadCSV';
import { withTranslation } from "react-i18next";
import AcademicYearFilterPanel from '../ReusableComponents/AcademicYearFilterPanel';

class FacultyDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        
        if (!this.props.academicYear) {
            this.props.actions.setFacultyAcademicYear(currentAcademicYear);
        }
        this._isMounted = false;
        this.onSubmit = this.onSubmit.bind(this);
    }

    onFacultyClick = (event) => {
        let { facultyFilter = {}, actions } = this.props;
        facultyFilter.faculty = event.target.id.slice(12).split('--').join(' ');
        actions.setFacultyFilter({ ...facultyFilter });
    }

    onFacultySelect = (option) => {
        let { facultyFilter = {}, actions } = this.props;
        facultyFilter.faculty = option.value;
        actions.setFacultyFilter({ ...facultyFilter });
    }
    onCurrentFacultyGroupSelect = (option) => {
        let { facultyFilter = {}, actions } = this.props;
        facultyFilter.facultyGroup = option.value;
        actions.setFacultyFilter({ ...facultyFilter });
    }
    onCurrentDepartmentSelect = (option) => {
        let { facultyFilter = {}, actions } = this.props;
        facultyFilter.department = option.value;
        actions.setFacultyFilter({ ...facultyFilter });
    }

    onDatesChange = ({ startDate, endDate }) => {
        let { facultyFilter = {}, actions } = this.props;
        facultyFilter.startDate = startDate;
        facultyFilter.endDate = endDate;
        actions.setFacultyFilter({ ...facultyFilter });
    }

    onSelectAcademicYear = (academicYear) => {
        this.props.actions.setFacultyAcademicYear( academicYear );
    }

    async onSubmit() {
        // turn loader on
        this.props.actions.setFacultyDashboardLoaderState(true);
        getAllData('faculty', this.props.academicYear.value)
            .then(({ allResidentRecords, facultyList, departmentList, facultyGroupList, courseName }) => {
                // set the values on the state 
                const { actions } = this.props;
                actions.setFacultyResidentRecords(allResidentRecords);
                actions.setFacultyList(facultyList);
                actions.setFacultyGroupList(facultyGroupList);
                actions.setFacultyDepartmentList(departmentList);
                actions.setFacultyCourse(courseName);
                let { facultyFilter = {} } = this.props;
                facultyFilter.faculty = 'ALL';
                facultyFilter.facultyGroup = 'ALL';
                facultyFilter.deparment = 'ALL';
                facultyFilter.startDate = null;
                facultyFilter.endDate = null;
                actions.setFacultyFilter({ ...facultyFilter });
                actions.setFacultyDashboardLoaderState(false);
            })
            // toggle loader again once the request completes
            .catch(() => {
                const { actions } = this.props;
                actions.setFacultyResidentRecords([]);
                actions.setFacultyList([]);
                actions.setFacultyGroupList([]);
                actions.setFacultyDepartmentList([]);
                actions.setFacultyCourse('');
                let { facultyFilter = {} } = this.props;
                facultyFilter.faculty = 'ALL';
                facultyFilter.facultyGroup = 'ALL';
                facultyFilter.deparment = 'ALL';
                facultyFilter.startDate = null;
                facultyFilter.endDate = null;
                actions.setFacultyFilter({ ...facultyFilter });
                actions.setFacultyDashboardLoaderState(false);
                console.log("error in fetching all resident records");
            });
    }

    componentDidMount() { this._isMounted = true }
    componentWillUnmount() { this._isMounted = false }


    printDashboard = () => {
        jQuery('.clearfix.inner-content').children('').each(function (i, r) {
            if (r.id !== 'cbme-dashboard') { jQuery(r).addClass('no-printing') }
        });
        jQuery('#cbme-dashboard').children('').each(function (i, r) {
            if (r.id !== 'visual-summary-content-mount') { jQuery(r).addClass('no-printing') }
        });

        alert(this.props.t("You will be prompted to print the page by your browser. You can also save the report by selecting 'Save as PDF' instead."));
        window.print();
    }

    downloadReport = () => {

        const { allResidentRecords = [], academicYear, facultyFilter, t } = this.props;
        const currentFaculty = facultyFilter.faculty;
        const currentFacultyGroup = facultyFilter.facultyGroup;
        const currentDepartment = facultyFilter.department;
        const startDate = facultyFilter.startDate;
        const endDate = facultyFilter.endDate;

        const processedRecords = processFacultyMap(allResidentRecords, currentFacultyGroup, currentDepartment, startDate, endDate),
            relevantData = _.map(processedRecords, d => {
                let expiredCount = d.expiredRecords.length,
                    completedCount = d.records.length,
                    inProgressCount = d.inProgressRecords.length,
                    overallCount = completedCount + inProgressCount + expiredCount;
                return [d.faculty_name, overallCount, completedCount, inProgressCount, expiredCount];
            }),
            csvData = currentFaculty == "ALL" ? relevantData : _.filter(relevantData, (d) => d[0] == currentFaculty);

        downloadCSV(['Assessor', 'Overall Assessments', 'Completed', 'In progress', 'Expired'], csvData, academicYear.label + '-' + 'assessor-report');
    }


    render() {

        const { facultyGroupList = [], facultyList = [], departmentList = [], allResidentRecords = [],
            courseName, isLoaderVisible, facultyFilter, actions, t } = this.props;

        let { academicYear } = this.props
        
        const currentFaculty = facultyFilter.faculty;
        const currentFacultyGroup = facultyFilter.facultyGroup;
        const currentDepartment = facultyFilter.department;
        const startDate = facultyFilter.startDate;
        const endDate = facultyFilter.endDate;        

        const processedRecords = processFacultyMap(allResidentRecords, currentFacultyGroup, currentDepartment, startDate, endDate),
            currentFacultyRecords = _.filter(processedRecords, (d) => d.faculty_name == currentFaculty),
            overallWidth = window.dynamicDashboard.mountWidth;

        // quick fix to legacy code 
        // if a faculty name doesnt appear in the processed records remove it also 
        // from the original faculty list
        let facultyWithEnoughRecords = _.map(processedRecords, (d) => d.faculty_name);
        let filteredFacultyList = _.filter(facultyList, (d) => {
            if (d.value == "ALL") { return true }
            else { return facultyWithEnoughRecords.indexOf(d.value) > -1 }
        });

        return (
            <div className='supervisor-dashboard-container'>
                <div className='custom-select-wrapper no-printing m-b'>
                    <div className='multi-selection-box m-r'>
                        <h2 className='header'>{t("Academic Year")}</h2>
                        <div className='react-select-root' style={{ 'width': 150 }}>
                            <ReactSelect
                                value={academicYear}
                                options={possibleAcademicYears}
                                styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                                onChange={this.onSelectAcademicYear} />
                        </div>
                    </div>
                    <button type="submit" className="filter-button btn btn-primary-outline m-r" onClick={this.onSubmit}>
                        {t("GET RECORDS")}
                    </button>
                </div>
                {isLoaderVisible ?
                    <div className='text-center'>
                        <i className='fa fa-spinner fa-5x fa-spin m-t-lg' aria-hidden="true"></i>
                    </div>
                    :
                    <div>
                        {facultyList.length > 0 &&
                            <div>
                                <FacultyFilterPanel
                                    facultyList={filteredFacultyList}
                                    facultyGroupList={facultyGroupList}
                                    departmentList={departmentList}
                                    currentFaculty={currentFaculty}
                                    currentDepartment={currentDepartment}
                                    currentFacultyGroup={currentFacultyGroup}
                                    onCurrentFacultyGroupSelect={this.onCurrentFacultyGroupSelect}
                                    onCurrentDepartmentSelect={this.onCurrentDepartmentSelect}
                                    onFacultySelect={this.onFacultySelect} />

                                <div>
                                    <AcademicYearFilterPanel
                                        academicYear={academicYear}
                                        onDatesChange={this.onDatesChange}
                                        startDate={startDate}
                                        endDate={endDate}/>
                                </div>

                                <div className='m-a'>

                                    <div className='text-right m-r-md m-t-md no-printing'>
                                        <button onClick={this.downloadReport} className='btn btn btn-primary-outline m-r'> <i className="fa fa-download"></i> {" " + t("Download Assessor Report")}</button>
                                        {currentFaculty != "ALL" && <button onClick={this.printDashboard} className='btn btn btn-primary-outline'> <i className="fa fa-download"></i> {" " + t("Print Assessor Dashboard")}</button>}
                                    </div>

                                    <h3 className='print-title text-center'> {t("Faculty Dashboard Report")} : {courseName}</h3>
                                    <h3 className='print-title text-center'> {t("Academic Year")} : {academicYear.label} </h3>
                                    <h3 className='print-title text-center m-b'> {t("Assessor")} : {currentFaculty}</h3>

                                    <FacultyInfoGroup
                                        width={overallWidth}
                                        processedRecords={processedRecords}
                                        currentFacultyRecords={currentFacultyRecords}
                                        currentFaculty={currentFaculty} />

                                    <FacultyGraphGroup
                                        width={overallWidth}
                                        processedRecords={processedRecords}
                                        selectFaculty={this.onFacultyClick}
                                        currentFaculty={currentFaculty} />

                                    <FacultyRecordTable
                                        currentFaculty={currentFaculty}
                                        width={overallWidth}
                                        currentFacultyRecords={currentFacultyRecords} />

                                    <FacultyExpiredRecordTable
                                        currentFaculty={currentFaculty}
                                        width={overallWidth}
                                        currentFacultyRecords={currentFacultyRecords} />
                                </div>
                            </div>}
                    </div>}
            </div>);
    }

}

function mapStateToProps(state) {
    return {
        facultyFilter: state.oracle.facultyFilter,
        facultyList: state.oracle.facultyList,
        facultyGroupList: state.oracle.facultyGroupList,
        departmentList: state.oracle.facultyDepartmentList,
        courseName: state.oracle.facultyCourse,
        allResidentRecords: state.oracle.facultyDashboardResidentRecords,
        isLoaderVisible: state.oracle.facultyDashboardLoaderState,
        academicYear: state.oracle.facultyAcademicYear
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setFacultyDashboardLoaderState, 
            setFacultyAcademicYear, 
            setFacultyResidentRecords, 
            setFacultyList, 
            setFacultyGroupList, 
            setFacultyDepartmentList,
            setFacultyCourse,
            setFacultyFilter
        }, dispatch)
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(FacultyDashboard));