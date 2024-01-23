import * as types from '../actions/actionTypes';
import initialState from './initialState';

// Perils of having a nested tree strucutre in the Redux State XD XD XD 
export default function oracleReducer(state = initialState.oracle, action) {
  switch (action.type) {
    case types.TOGGLE_LOADER:
      return Object.assign({}, state, { loaderState: !state.loaderState })
    case types.TOGGLE_FILTER_LOADER:
      return Object.assign({}, state, { filterLoaderState: !state.filterLoaderState })
    case types.SET_ACTIVE_DASHBOARD:
      return Object.assign({}, state, { activePage: action.activePage })
    case types.SET_RESIDENT_LIST:
      return Object.assign({}, state, { residentList: action.residentList })
    case types.SET_RESIDENT_SCHEDULE:
      return Object.assign({}, state, { rotationSchedule: action.rotationSchedule })
    case types.SET_RESIDENT_FILTER:
      return Object.assign({}, state, { residentFilter: action.residentFilter })
    case types.SET_RESIDENT_DATA:
      return Object.assign({}, state, { residentData: { ...action.residentData } })
    case types.SET_EXPIRED_DATA:
      return Object.assign({}, state, { expiredData: { ...action.expiredData } })
    case types.SET_TOOLTIP_VISIBILITY:
      return Object.assign({}, state, { isTooltipVisible: action.isTooltipVisible })
    case types.SET_TOOLTIP_DATA:
      return Object.assign({}, state, { tooltipData: action.tooltipData })
    case types.SET_RO_TOOLTIP_VISIBILITY:
      return Object.assign({}, state, { isRotationTooltipVisible: action.isRotationTooltipVisible })
    case types.SET_RO_TOOLTIP_DATA:
      return Object.assign({}, state, { rotationTooltipData: action.rotationTooltipData })
    case types.SET_VISIBILITY_OPEN_STATUS:
      return Object.assign({}, state, { visibilityOpenStatus: action.visibilityOpenStatus })
    case types.SET_PROGRAM_INFO:
      return Object.assign({}, state, { programInfo: action.programInfo })

    // Faculty Dashboard actions
    case types.SET_FACULTY_FILTER:
      return Object.assign({}, state, { facultyFilter: action.facultyFilter })
    case types.SET_FACULTY_LIST:
      return Object.assign({}, state, { facultyList: action.facultyList })
    case types.SET_FACULTY_GROUP_LIST:
      return Object.assign({}, state, { facultyGroupList: action.groupList })
    case types.SET_FACULTY_DEPARTMENT_LIST:
      return Object.assign({}, state, { facultyDepartmentList: action.facultyDepartmentList })
    case types.SET_FACULTY_LOADER_STATE:
      return Object.assign({}, state, { facultyDashboardLoaderState: action.state })
    case types.SET_FACULTY_COURSE:
      return Object.assign({}, state, { facultyCourse: action.facultyCourse })
    case types.SET_FACULTY_ACADEMIC_YEAR:
      return Object.assign({}, state, { facultyAcademicYear: action.academicYear })
    case types.SET_FACULTY_RESIDENT_RECORDS:
      return Object.assign({}, state, { facultyDashboardResidentRecords: action.residentRecords})

    // Program Evaluation Dashboard actions
    case types.SET_PROGRAM_EVAL_FILTER:
      return Object.assign({}, state, { programEvalFilter: action.filter })
    case types.SET_PROGRAM_EVAL_ACADEMIC_YEARS:
      return Object.assign({}, state, { programEvalAcademicYears: action.years })
    case types.SET_PROGRAM_EVAL_RESIDENT_RECORDS:
      return Object.assign({}, state, { programEvalResidentRecords: action.residentRecords })
    case types.SET_PROGRAM_EVAL_LOADER_STATE:
      return Object.assign({}, state, { programEvalLoaderState: action.state })
    default:
      return state;
  }
}
