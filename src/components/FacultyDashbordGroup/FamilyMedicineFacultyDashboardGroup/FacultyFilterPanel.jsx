import React, { Component } from 'react';
import ReactSelect from 'react-select';
import infoTooltipReference from '../../../utils/infoTooltipReference';
import ReactTooltip from 'react-tooltip';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class FacultyFilterPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { facultyList, academicYearList, courseSiteList,
            currentFaculty, currentCourse, currentAcademicYear,
            onFacultySelect, onCurrentCourseSelect, onCurrentAcademicYearSelect,
            sliderValue = 5, onSliderChange, isFamilyMedicine } = this.props;

        // Process faculty name value so they match the react select format
        const currentFacultyValue = _.find(facultyList, (d) => d.value == currentFaculty) || null;
        // Process academic year value so they match the react select format
        const currentAcademicYearValue = _.find(academicYearList, (d) => d.value == currentAcademicYear) || null;
        // Process course name value so they match the react select format
        const currentCourseValue = _.find(courseSiteList, (d) => d.value == currentCourse) || null;

        return (
            <div className='filter-panel faculty-filter'>
                <div className='text-xs-left advanced-filter-box normative-filter-box'>
                    {isFamilyMedicine &&
                        <div className='react-select-root'>
                            <label className='filter-label'> Program Site
                                <i data-for='faculty-infotip' data-tip={infoTooltipReference.facultyDevlopment.filterCourse} className="fa fa-info-circle instant-tooltip-trigger"></i>
                            </label>
                            <ReactSelect
                                placeholder='Select Program Site...'
                                isSearchable={true}
                                value={currentCourseValue}
                                options={courseSiteList}
                                styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                                onChange={onCurrentCourseSelect} />
                        </div>}
                    <div className='react-select-root'>
                        <label className='filter-label'>Faculty
                            <i data-for='faculty-infotip' data-tip={infoTooltipReference.facultyDevlopment.filterFaculty} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <ReactSelect
                            placeholder='Select Faculty...'
                            isSearchable={true}
                            value={currentFacultyValue}
                            options={facultyList}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={onFacultySelect} />
                    </div>
                    <div className='react-select-root'>
                        <label className='filter-label'>Academic Year
                            <i data-for='faculty-infotip' data-tip={infoTooltipReference.facultyDevlopment.filterYear} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <ReactSelect
                            placeholder='Select Academic Year...'
                            isSearchable={true}
                            value={currentAcademicYearValue}
                            options={academicYearList}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={onCurrentAcademicYearSelect} />
                    </div>
                    <div className='slider-container'>
                        <label className='filter-label'>Filter out Faculty with &lt; </label>
                        <h2>{sliderValue}</h2>
                        <label className='filter-label'>records
                            <i data-for='faculty-infotip' data-tip={infoTooltipReference.facultyDevlopment.filterOutFacultyWithMinimumRecords} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <Slider min={0} max={25} step={1} defaultValue={sliderValue} onAfterChange={onSliderChange} />
                    </div>
                    <ReactTooltip id='faculty-infotip' className='custom-react-tooltip' />
                </div>
            </div>)
    }

}

