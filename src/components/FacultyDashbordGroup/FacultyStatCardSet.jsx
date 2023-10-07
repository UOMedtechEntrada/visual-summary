import React from 'react';
import { MicroStatCard } from '..';
import FacultyScorePie from './FacultyScorePie';
import PhaseSummaryPie from './PhaseSummaryPie';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { withTranslation } from "react-i18next";

const phaseList = dashboard_options.dashboard_stages.map((d) => d.target_code);

export default withTranslation()((props) => {

    const { processedRecords = [], title, showNA = false, tooltipRef, tooltipID, t } = props;

    let EPACount = !showNA ? _.sumBy(processedRecords, (d) => d.epa_count) : 'N/A';

    let defaultPhaseArray = _.map(phaseList, e => 0), defaultRatingArray = _.times(window.mostCommonScaleRatings.length, e => 0);

    let averageEPAScore = !showNA ? Math.round((_.meanBy(processedRecords, (d) => d.entrustment_score) || 0) * 100) / 100 : 'N/A',
        averageWords = !showNA ? Math.round(_.meanBy(processedRecords, (d) => d.words_per_comment) || 0) : 'N/A',
        averageExpiryRate = !showNA ? Math.round(_.meanBy(processedRecords, (d) => d.expiry_rate) || 0) : 'N/A',
        ratingGroupSet = !showNA ? _.reduce(processedRecords, (acc, d) => _.map(acc, (inner_d, i) => (inner_d + d.rating_group[i])), defaultRatingArray) : [],
        phaseGroupSet = !showNA ? _.reduce(processedRecords, (acc, d) => _.map(acc, (inner_d, i) => (inner_d + d.phase_group[i])), defaultPhaseArray) : [];

    return <div className='faculty-MicroStatCard-group'>
        <div className="hr-divider">
            <h4 className="hr-divider-content">
                {title}
                <i data-for={tooltipID} data-tip={tooltipRef} className="fa fa-info-circle instant-tooltip-trigger"></i>
            </h4>
        </div>
        <div className='text-center'>
            <MicroStatCard style={{ display: 'inline' }} title={t('Total EPAs observed')} type='success' metric={EPACount} />
            <MicroStatCard style={{ display: 'inline' }} title={t('Mean EPA Score')} type='primary' metric={averageEPAScore} />
            <MicroStatCard style={{ display: 'inline' }} title={t('EPA Expiry Rate')} type='danger' metric={averageExpiryRate + (averageExpiryRate != 'NA' ? '%' : '')} />
            <MicroStatCard style={{ display: 'inline' }} title={t('Mean Words Per Comment')} type='info' metric={averageWords} />
            <FacultyScorePie data={ratingGroupSet} />
            <PhaseSummaryPie data={phaseGroupSet} />
        </div>
        <ReactTooltip id={tooltipID} className='custom-react-tooltip' />
    </div>
});
