let isFamilyMedicine

export default {
  oracle: {
    loaderState: false,
    filterLoaderState: false,
    activePage: dashboard_options.dashboard_mode == 'resident' ? 'resident' : 'normative',
    isFamilyMedicine: dashboard_options.course_name.toLowerCase().indexOf('family medicine') > -1 || false,
    residentData: null,
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
    programInfo: null
  }
};
