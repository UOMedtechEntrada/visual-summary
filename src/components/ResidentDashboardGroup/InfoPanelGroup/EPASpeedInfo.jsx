import React from 'react';
import { MicroStatCard, StatCard } from '../../';
import WeeklyEPAChart from './WeeklyEPAChart';
import infoTooltipReference from '../../../utils/infoTooltipReference';
import ReactTooltip from 'react-tooltip';

export default (props) => {

    const { residentData, smallScreen, residentFilter, width,
        residentInfo = {}, isFamilyMedicine } = props,
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

    const assessmentIdentifierText = isFamilyMedicine ? 'Field Note' : 'EPA';

    return (
        <div className='epaSpeedBox text-center'>
            <div className="hr-divider">
                <h4 className="hr-divider-content"> ACQUISITION METRICS  <i data-for='acq-infotip' data-tip={infoTooltipReference.residentMetrics.acquisitionMetricsForResident} className="fa fa-info-circle instant-tooltip-trigger"></i></h4>
                <ReactTooltip id='acq-infotip' className='custom-react-tooltip' />
            </div>
            <div className='card-wrapper'>
                {residentFilter.isAllData ?
                    <div className='row text-center m-t'>
                        <CardComponent extraWide={isFamilyMedicine} title={'Total ' + assessmentIdentifierText + 's Observed'} type='primary' metric={totalEPAs} />
                        {!isFamilyMedicine && <CardComponent title='Progress Rate' type='success' metric={totalProgress + '%'} />}
                        {!isFamilyMedicine && <CardComponent title='Achievement Rate' type='danger' metric={achievementRate + '%'} />}
                    </div> :
                    <div className='row text-center'>
                        <CardComponent extraWide={isFamilyMedicine} dual={true} title={'Total ' + assessmentIdentifierText + 's Observed'} type='primary' metric={totalEPAs} secondMetric={recordsInPeriodCount} />
                        {!isFamilyMedicine && <CardComponent title='Progress Rate' type='success' metric={totalProgress + '%'} />}
                        {!isFamilyMedicine && <CardComponent title='Achievement Rate' type='danger' metric={achievementRate + '%'} />}
                    </div>}
            </div>
            {!smallScreen &&
                < WeeklyEPAChart
                    // the three cards in EPASpeedInfo each take 160 pixels 
                    // so removing that and the extra margin
                    width={width - (isFamilyMedicine ? 235 : 575)}
                    residentData={residentData}
                    residentInfo={residentInfo}
                    residentFilter={residentFilter} />}
        </div>)

}


