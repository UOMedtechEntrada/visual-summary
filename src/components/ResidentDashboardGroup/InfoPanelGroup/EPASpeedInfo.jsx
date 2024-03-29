import React from 'react';
import { MicroStatCard, StatCard } from '../../';
import WeeklyEPAChart from './WeeklyEPAChart';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { withTranslation } from "react-i18next";

export default withTranslation()((props) => {

    const { residentData, smallScreen, residentFilter, width,
        residentInfo = {} } = props,
        residentDataList = _.flatMap(residentData);

    // Get the required Metrics 
    let totalEPAs = Math.max(residentInfo.totalAssessments, residentDataList.length),
        { achievementRate = 0, totalProgress = 0 } = residentInfo,
        recordsInPeriod, recordsInPeriodCount;
    // if there is a date range
    if (!residentFilter.isAllData) {
        recordsInPeriod = _.filter(residentDataList, (d) => d.mark);
        recordsInPeriodCount = recordsInPeriod.length;
    }

    // One mobile screens we hide the weekly chart and show regular statcards
    const CardComponent = smallScreen ? StatCard : MicroStatCard;

    return (
        <div className='epaSpeedBox'>
            <div className="hr-divider">
                <h4 className="hr-divider-content"> {props.t("ACQUISITION METRICS")}  <i data-for='acq-infotip' data-tip={props.t("residentMetrics-acquisitionMetricsForResident")} className="fa fa-info-circle instant-tooltip-trigger"></i></h4>
                <ReactTooltip id='acq-infotip' className='custom-react-tooltip' />
            </div>
            <div className='card-wrapper'>
                {residentFilter.isAllData ?
                    <div className='row text-center'>
                        <CardComponent title={props.t('Total EPAs Observed')} type='primary' metric={totalEPAs} />
                        <CardComponent title={props.t('Progress Rate')} type='success' metric={totalProgress + '%'} />
                        <CardComponent title={props.t('Achievement Rate')} type='danger' metric={achievementRate + '%'} />
                    </div> :
                    <div className='row text-center'>
                        <CardComponent dual={true} title={props.t('Total EPAs Observed')} type='primary' metric={totalEPAs} secondMetric={recordsInPeriodCount} />
                        <CardComponent title={props.t('Progress Rate')} type='success' metric={totalProgress + '%'} />
                        <CardComponent title={props.t('Achievement Rate')} type='danger' metric={achievementRate + '%'} />
                    </div>}
            </div>
            {!smallScreen &&
                < WeeklyEPAChart
                    // the three cards in EPASpeedInfo each take 160 pixels 
                    // so removing that and the extra margin
                    width={width - 575}
                    residentData={residentData}
                    residentInfo={residentInfo}
                    residentFilter={residentFilter} />}
        </div>)

});


