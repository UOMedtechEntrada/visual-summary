import * as types from './actionTypes';
import _ from 'lodash';
import { getLearnerData } from '../../utils/requestServer';
import moment from 'moment';


export function setLevelVisibilityStatus(visibilityOpenStatus) {
    return { type: types.SET_VISIBILITY_OPEN_STATUS, visibilityOpenStatus }
}

export function toggleLoader() {
    return { type: types.TOGGLE_LOADER };
}

export function setactivePage(activePage) {
    return { type: types.SET_ACTIVE_DASHBOARD, activePage };
}

export function toggleFilterLoader() {
    return { type: types.TOGGLE_FILTER_LOADER };
}

export function setResidentList(residentList) {
    return { type: types.SET_RESIDENT_LIST, residentList };
}

export function setResidentFilter(residentFilter) {
    return { type: types.SET_RESIDENT_FILTER, residentFilter };
}

export function updateResidentData(residentData) {
    return { type: types.SET_RESIDENT_DATA, residentData };
}

export function setResidentData(residentData, residentInfo = false, programInfo, rotationSchedule = [], expiredData = []) {

    let visibilityOpenStatus = {
        1: false,
        2: false,
        3: false,
        4: false
    }, currentPhaseIndex = 0;

    // If there is additional information about the resident then
    // set it to the redux store and also open the respective phase panel
    if (!!residentInfo) {

        // if open all phases is clicked on then open everything
        if (!residentInfo.openOnlyCurrentPhase) {
            visibilityOpenStatus = {
                1: true,
                2: true,
                3: true,
                4: true
            }
        }
        // if not open the current phase only
        else {
            switch (residentInfo.currentPhase) {
                case 'transition-to-discipline': currentPhaseIndex = 1; break;
                case 'foundations-of-discipline': currentPhaseIndex = 2; break;
                case 'core-discipline': currentPhaseIndex = 3; break;
                case 'transition-to-practice': currentPhaseIndex = 4; break;
            }
            visibilityOpenStatus[currentPhaseIndex] = true;
        }

        return dispatch => {
            dispatch(setLevelVisibilityStatus(visibilityOpenStatus));
            dispatch({ type: types.SET_PROGRAM_INFO, programInfo });
            dispatch({ type: types.SET_RESIDENT_DATA, residentData });
            dispatch({ type: types.SET_EXPIRED_DATA, expiredData });
            dispatch({ type: types.SET_RESIDENT_SCHEDULE, rotationSchedule });
        };
    }
    // if not simply dispatch the change to residentData alone
    return dispatch => {
        dispatch({ type: types.SET_RESIDENT_DATA, residentData });
        dispatch({ type: types.SET_EXPIRED_DATA, expiredData });
    };

}

export function setProgramInfo(programInfo) {
    return { type: types.SET_PROGRAM_INFO, programInfo };
}

export function setTooltipData(tooltipData) {
    return { type: types.SET_TOOLTIP_DATA, tooltipData };
}

export function showTooltip(isTooltipVisible, tooltipData) {
    return dispatch => {
        if (!!tooltipData) {
            dispatch(setTooltipData(tooltipData));
        }
        dispatch({ type: types.SET_TOOLTIP_VISIBILITY, isTooltipVisible });
    };
}

// Duplicate :-(
export function showRotationTooltip(isRotationTooltipVisible, rotationTooltipData) {
    return dispatch => {
        if (!!rotationTooltipData) { dispatch(setRotationTooltipData(rotationTooltipData)) }
        dispatch({ type: types.SET_RO_TOOLTIP_VISIBILITY, isRotationTooltipVisible });
    };
}

export function setRotationTooltipData(rotationTooltipData) {
    return { type: types.SET_RO_TOOLTIP_DATA, rotationTooltipData };
}


// Not so elegant solution  but its needed when a user needs to be automatically switched between dashboards
export function switchToResidentDashboard(residentInfo, residentFilter) {

    return dispatch => {
        dispatch(setactivePage('resident'));
        // set all the parameters in the resident filter
        dispatch(setResidentFilter({ ...residentFilter }))
        // then clear any previously selected residents data
        dispatch(setResidentData(null))
        // then start the loading filter
        dispatch(toggleFilterLoader());
        // fetch data from server based on the filter params
        getLearnerData(residentFilter.username, residentInfo)
            .then((processedData) => {
                const { programInfo, residentData, rotationSchedule, expiredData } = processedData;
                // mark records to so record is set in a date period filter
                var markedResidentData = _.map(residentData, (d) => {
                    if (residentFilter.isAllData) { d.mark = false }
                    else if (!!residentFilter.startDate && !!residentFilter.endDate) {
                        d.mark = moment(d.Date, 'YYYY-MM-DD').isBetween(residentFilter.startDate, residentFilter.endDate, 'days', '[]')
                    }
                    else { d.mark = false }
                    return d;
                });
                // group data on the basis of EPA
                var groupedResidentData = _.groupBy(markedResidentData, (d) => d.EPA);
                // if uncommenced EPAs are needed to be seen then sub in empty records and 
                // sort records by Date --force
                _.map(programInfo.epaSourceMap, (source) => {
                    _.map(source.subRoot, (epa, innerKey) => {
                        groupedResidentData[innerKey] = _.sortBy(groupedResidentData[innerKey] || [], (d) => d.Date);
                    })
                })
                // store the info of visibility of phase into resident info
                residentInfo.openOnlyCurrentPhase = true;
                dispatch(setResidentData(groupedResidentData, residentInfo, programInfo, rotationSchedule, expiredData));
            })
            .finally(() => { dispatch(toggleFilterLoader()); });
    };
}

// Faculty Dasboard
export function setFacultyFilter(facultyFilter) {
    return { type: types.SET_FACULTY_FILTER, facultyFilter };
}

export function setFacultyList(facultyList) {
    return { type: types.SET_FACULTY_LIST, facultyList };
}

export function setFacultyGroupList(groupList) {
    return { type: types.SET_FACULTY_GROUP_LIST, groupList };
}

export function setFacultyDepartmentList(facultyDepartmentList) {
    return { type: types.SET_FACULTY_DEPARTMENT_LIST, facultyDepartmentList };
}

export function setFacultyDashboardLoaderState(state) {
    return { type: types.SET_FACULTY_LOADER_STATE, state };
}

export function setFacultyCourse(facultyCourse) {
    return { type: types.SET_FACULTY_COURSE, facultyCourse };
}

export function setFacultyAcademicYear(academicYear) {
    return { type: types.SET_FACULTY_ACADEMIC_YEAR, academicYear };
}

export function setFacultyResidentRecords(residentRecords) {
    return { type: types.SET_FACULTY_RESIDENT_RECORDS, residentRecords };
}

// Program Evaluation Dashboard
export function setProgramEvalFilter(filter) {
    return { type: types.SET_PROGRAM_EVAL_FILTER, filter };
}

export function setProgramEvalAcademicYears(years) {
    return { type: types.SET_PROGRAM_EVAL_ACADEMIC_YEARS, years };
}

export function setProgramEvalResidentRecords(residentRecords) {
    return { type: types.SET_PROGRAM_EVAL_RESIDENT_RECORDS, residentRecords };
}

export function setProgramEvalLoaderState(state) {
    return { type: types.SET_PROGRAM_EVAL_LOADER_STATE, state };
}
