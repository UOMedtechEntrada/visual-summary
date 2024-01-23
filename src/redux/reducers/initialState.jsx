export default {
  oracle: {
    loaderState: false,
    filterLoaderState: false,
    activePage: dashboard_options.dashboard_mode == 'resident' ? 'resident' : 'normative',
    userType: dashboard_options.user_type == 'medtech' ? 'medtech' : 'non-admin',
    isUG: dashboard_options.active_organisation.toLowerCase().indexOf('undergraduate') > -1 || dashboard_options.active_organisation.toLowerCase().indexOf('ug') > -1,
    residentData: null,
    expiredData: null,
    rotationSchedule: [],
    residentFilter: {
      isAllData: true,
      startDate: null,
      endDate: null,
      hideNoDataEPAs: false
    },
    isTooltipVisible: false,
    tooltipData: null,
    isRotationTooltipVisible: false,
    rotationTooltipData: null,
    visibilityOpenStatus: {
      1: true,
      2: true,
      3: true,
      4: true
    },
    programInfo: null,

    // faculty dashboard
    facultyFilter: {
      faculty: 'ALL',
      facultyGroup: 'ALL',
      department: 'ALL',
      startDate: null,
      endDate: null
    },
    facultyList: [],
    facultyGroupList: [],
    facultyDepartmentList: [],
    facultyCourse: null,
    facultyAcademicYear: null,
    facultyDashboardResidentRecords: [],
    facultyDashboardLoaderState: false,

    // program evaluation dashboard
    programEvalFilter: {
      startDate: null,
      endDate: null
    },
    programEvalAcademicYears: [],
    programEvalLoaderState: false,
    programEvalResidentRecords: []
  }
};
