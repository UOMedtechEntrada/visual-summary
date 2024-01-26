import React, { Component } from 'react';
import _ from 'lodash';
import { getAllData } from '../../utils/requestServer';
import processFacultyMap from '../../utils/processors/processFacultyMap';
import {
    FacultyFilterPanel, FacultyInfoGroup,
    FacultyRecordTable, FacultyGraphGroup,
    // custom compoments customized for family medicine
    FMFacultyFilterPanel, FMFacultyInfoGroup,
    FMFacultyRecordTable, FMFacultyGraphGroup

} from '../';

export default class FacultyDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCourse: 'ALL',
            currentFaculty: 'ALL',
            currentAcademicYear: 'ALL',
            facultyList: [],
            sliderValue: 5,
            epa_list: [],
            // list of all resident records
            allResidentRecords: [],
            isLoaderVisible: false,
        };
        this._isMounted = false;
    }

    onFacultyClick = (event) => { this.setState({ 'currentFaculty': event.target.id.slice(12).split('--').join(' ') }) }
    onSliderChange = (sliderValue) => { this.setState({ sliderValue }) }
    onFacultySelect = (option) => { this.setState({ currentFaculty: option.value }) }
    onCurrentAcademicYearSelect = (option) => { this.setState({ currentAcademicYear: option.value }) }
    onCurrentCourseSelect = (option) => { this.setState({ currentCourse: option.value }) }

    componentDidMount() {
        this._isMounted = true;

        const { isFamilyMedicine } = this.props;

        if (isFamilyMedicine) {


            const course_picker = document.getElementById('cbme-course-picker');

            let courses = [{ 'value': course_id, 'label': course_id }];

            if (course_picker && course_picker.options.length > 0) {
                courses = [...course_picker.options]
                    .map(e => ({ 'value': e.value, 'label': e.innerText }))
                    .filter(e => e.label.toLowerCase().indexOf('family medicine') > -1);
            }
           

            // turn loader on
            this.setState({ isLoaderVisible: true });

            Promise.all(courses.map((c) => getAllData(true, c.value)))
                .then((course_data_list) => {

                    // merge data for all the courses,
                    // let dashboard_epas be empty as its irrelevant for family medicine programs
                    let allResidentRecords = [], dashboard_epas = [];
                    _.map(course_data_list, e => {
                        allResidentRecords = allResidentRecords.concat(e.allResidentRecords);
                    });

                    // create a list of all faculty 
                    let facultyList = _.map(_.groupBy(allResidentRecords, (d) => d.Assessor_Name), (recs, key) => ({ 'label': key + " (" + recs.length + ")", 'value': key }))
                        .sort((previous, current) => previous.label.localeCompare(current.label));
                    // create a list of academic years 
                    let academicYearList = _.map(_.groupBy(allResidentRecords, (d) => d.Academic_Year), (recs, key) => ({ 'label': key, 'value': key }))
                        .sort((previous, current) => previous.label.localeCompare(current.label));
                    // create a list of course names based on the values returned from server 
                    let courseSiteList = _.map(_.groupBy(allResidentRecords, (d) => d.Course_Name), (recs, key) => ({ 'label': key, 'value': key }))
                        .sort((previous, current) => previous.label.localeCompare(current.label));

                    // sub in a value at the front of the list for 'ALL'
                    facultyList.unshift({ 'label': 'All', 'value': 'ALL' });
                    // sub in a value at the front of the list for 'ALL'
                    academicYearList.unshift({ 'label': 'All', 'value': 'ALL' });
                    // sub in a value at the front of the list for 'ALL'
                    courseSiteList.unshift({ 'label': 'All', 'value': 'ALL' });
                    // set the values on the state 
                    this._isMounted && this.setState({ allResidentRecords, facultyList, academicYearList, courseSiteList, 'epa_list': [...dashboard_epas], isLoaderVisible: false });

                })
                .catch(() => {
                    console.log("error in fetching all resident records");
                    this._isMounted && this.setState({ allResidentRecords: [], isLoaderVisible: false });
                });


        }

        else {

            // turn loader on
            this.setState({ isLoaderVisible: true });

            getAllData()
                .then(({ allResidentRecords, dashboard_epas }) => {
                    // create a list of all faculty 
                    let facultyList = _.map(_.groupBy(allResidentRecords, (d) => d.Assessor_Name), (recs, key) => ({ 'label': key + " (" + recs.length + ")", 'value': key }))
                        .sort((previous, current) => previous.label.localeCompare(current.label));
                    // create a list of academic years 
                    let academicYearList = _.map(_.groupBy(allResidentRecords, (d) => d.Academic_Year), (recs, key) => ({ 'label': key, 'value': key }))
                        .sort((previous, current) => previous.label.localeCompare(current.label));

                    // sub in a value at the front of the list for 'ALL'
                    facultyList.unshift({ 'label': 'All', 'value': 'ALL' });
                    // sub in a value at the front of the list for 'ALL'
                    academicYearList.unshift({ 'label': 'All', 'value': 'ALL' });
                    // set the values on the state 
                    this._isMounted && this.setState({ allResidentRecords, facultyList, academicYearList, 'epa_list': [...dashboard_epas], isLoaderVisible: false });
                })
                // toggle loader again once the request completes
                .catch(() => {
                    console.log("error in fetching all resident records");
                    this._isMounted && this.setState({ allResidentRecords: [], isLoaderVisible: false });
                });
        }


    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {

        const { isFamilyMedicine } = this.props;

        const { facultyList = [], academicYearList = [], courseSiteList = [], allResidentRecords = [],
            currentFaculty, currentCourse, currentAcademicYear, epa_list = [], sliderValue } = this.state;

        const processedRecords = processFacultyMap(allResidentRecords, epa_list, currentAcademicYear, sliderValue, isFamilyMedicine, currentCourse),
            currentFacultyRecords = _.filter(processedRecords, (d) => d.faculty_name == currentFaculty),
            overallWidth = window.dynamicDashboard.mountWidth;

        // quick fix to legacy code 
        // if a faculty name doesnt appear in the processed records remove it also 
        // from the original faculty list
        let facultyWithEnoughRecords = _.map(processedRecords, (d) => d.faculty_name);
        let filteredFacultyList = _.filter(facultyList, (d) => {
            if (d.value == 'ALL') { return true }
            else { return facultyWithEnoughRecords.indexOf(d.value) > -1 }
        });

        return (
            <div className='supervisor-dashboard-container'>
                {this.state.isLoaderVisible ?
                    <div className='text-center'>
                        <i className='fa fa-spinner fa-5x fa-spin m-t-lg' aria-hidden="true"></i>
                    </div>
                    :
                    <div>
                        {isFamilyMedicine ?
                            <div>
                                <FMFacultyFilterPanel
                                    isFamilyMedicine={isFamilyMedicine}
                                    facultyList={filteredFacultyList}
                                    academicYearList={academicYearList}
                                    courseSiteList={courseSiteList}
                                    currentFaculty={currentFaculty}
                                    currentCourse={currentCourse}
                                    currentAcademicYear={currentAcademicYear}
                                    sliderValue={sliderValue}
                                    onSliderChange={this.onSliderChange}
                                    onCurrentAcademicYearSelect={this.onCurrentAcademicYearSelect}
                                    onCurrentCourseSelect={this.onCurrentCourseSelect}
                                    onFacultySelect={this.onFacultySelect} />
                                <div className='m-a'>
                                    <FMFacultyInfoGroup
                                        width={overallWidth}
                                        processedRecords={processedRecords}
                                        currentFacultyRecords={currentFacultyRecords}
                                        currentFaculty={currentFaculty} />
                                    <FMFacultyGraphGroup
                                        width={overallWidth}
                                        processedRecords={processedRecords}
                                        selectFaculty={this.onFacultyClick}
                                        currentFaculty={currentFaculty} />
                                    <FMFacultyRecordTable
                                        currentFaculty={currentFaculty}
                                        width={overallWidth}
                                        currentFacultyRecords={currentFacultyRecords} />
                                </div>
                            </div> :
                            <div>
                                <FacultyFilterPanel
                                    facultyList={filteredFacultyList}
                                    academicYearList={academicYearList}
                                    currentFaculty={currentFaculty}
                                    currentAcademicYear={currentAcademicYear}
                                    sliderValue={sliderValue}
                                    onSliderChange={this.onSliderChange}
                                    onCurrentAcademicYearSelect={this.onCurrentAcademicYearSelect}
                                    onFacultySelect={this.onFacultySelect}
                                />

                                <div className='m-a'>
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
                                </div>
                            </div>}

                    </div>}
            </div>);
    }

}
