import React, { Component } from 'react';
import ReactSelect from 'react-select';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
class FacultyFilterPanel extends Component {

    render() {

        const { facultyList, facultyGroupList, departmentList,
            currentFaculty, currentFacultyGroup, currentDepartment,
            onFacultySelect, onCurrentFacultyGroupSelect, onCurrentDepartmentSelect, t } = this.props;

        // Process faculty names so they match the react select format
        const currentFacultyValue = _.find(facultyList, (d) => d.value == currentFaculty) || null;
        // Process academic years so they match the react select format
        const currentFacultyGroupValue = _.find(facultyGroupList, (d) => d.value == currentFacultyGroup) || null;
        // Process academic years so they match the react select format
        const currentDepartmentValue = _.find(departmentList, (d) => d.value == currentDepartment) || null;

        return (
            <div className='filter-panel faculty-filter no-printing'>
                <div className='text-xs-left advanced-filter-box normative-filter-box'>
                    <div className='react-select-root'>
                        <label className='filter-label'>{t("Assessor Group")}
                            <i data-for='faculty-infotip' data-tip={t("facultyDevlopment-filterAssessorGroup")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <ReactSelect
                            placeholder={t("Select Assessor Group...")}
                            isSearchable={true}
                            value={currentFacultyGroupValue}
                            options={facultyGroupList}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={onCurrentFacultyGroupSelect} />
                    </div>
                    <div className='react-select-root'>
                        <label className='filter-label'>{t("Department")}
                            <i data-for='faculty-infotip' data-tip={t("facultyDevlopment-filterDepartment")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <ReactSelect
                            placeholder={t("Select Department...")}
                            isSearchable={true}
                            value={currentDepartmentValue}
                            options={departmentList}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={onCurrentDepartmentSelect} />
                    </div>
                    <div className='react-select-root'>
                        <label className='filter-label'>{t("Assessor")}
                            <i data-for='faculty-infotip' data-tip={t("facultyDevlopment-filterFaculty")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </label>
                        <ReactSelect
                            placeholder={t("Select Assessor...")}
                            isSearchable={true}
                            value={currentFacultyValue}
                            options={facultyList}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={onFacultySelect} />
                    </div>
                    <ReactTooltip id='faculty-infotip' className='custom-react-tooltip' />
                </div>
            </div>)
    }

}

export default withTranslation()(FacultyFilterPanel);