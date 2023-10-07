import React from 'react';
import FacultyStatCardSet from './FacultyStatCardSet';
import { withTranslation } from "react-i18next";

export default withTranslation()((props) => {

    const { currentFaculty, dateFilterActive, processedRecords, currentFacultyRecords, t } = props;

    return <div className='text-center'>
        <div className='print-info' style={{ 'display': 'inline-block', 'width': '1100px' }}>
            <FacultyStatCardSet
                tooltipRef={t("facultyDevlopment-acquisitionMetricsForAllFaculty")}
                tooltipID={'faculty-acq-all-infotip'}
                title={t("Acquisition Metrics for All Assessors in Program")}
                processedRecords={processedRecords}
                dateFilterActive={dateFilterActive} />
            {(currentFaculty !== 'ALL' && currentFaculty !== '') && <FacultyStatCardSet
                tooltipRef={t("facultyDevlopment-acquisitionMetricsForSingleFaculty")}
                tooltipID={'faculty-acq-selected-infotip'}
                title={t("Acquisition Metrics for Assessor - ") + currentFaculty}
                showNA={currentFaculty == 'ALL'}
                processedRecords={currentFaculty == 'ALL' ? [] : currentFacultyRecords}
                dateFilterActive={dateFilterActive} />}
        </div>
    </div>
});
