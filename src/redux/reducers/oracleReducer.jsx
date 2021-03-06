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
    default:
      return state;
  }
}
