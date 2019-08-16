import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import RotationSchedule from './RotationSchedule';
import EPASpeedInfo from './EPASpeedInfo';
import CiteScoreGraph from './CiteScoreGraph';
import OralScoreGraph from './OralScoreGraph';
import RecentEPATrend from './RecentEPATrend';
import NarrativeBlock from './NarrativeBlock';


class InfoPanel extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        let { residentData, residentFilter, residentList, expiredResidentData, narrativeData } = this.props,
            residentInfo = false, citeScoreData = {}, oralScoreData = {};

        if (residentFilter && residentFilter.username) {
            residentInfo = _.find(residentList, (resident) => resident.username == residentFilter.username);
            citeScoreData = residentInfo && residentInfo.citeExamScore;
            oralScoreData = residentInfo && residentInfo.oralExamScore;
        }

        //160px to offset the 30px margin on both sides and vertical scroll bar width
        const widthOfRoot = document.body.getBoundingClientRect().width - 160,
            smallScreen = widthOfRoot < 800;

        return (
            <div className='info-panel'>
                {residentInfo &&
                    <div className='info-panel-inner'>
                        <div className='titular-block'>
                            <span><b>CURRENT PHASE -</b> {residentInfo.currentPhase.split("-").join(" ")}</span>
                            <span><b>PROGRAM START DATE -</b> {(new Date(residentInfo.programStartDate)).toDateString()}</span>
                            <span><b>LAST UPDATED ON -</b> {(new Date(residentInfo.uploadedData)).toDateString()}</span>
                        </div>
                        {!!residentData &&
                            <RotationSchedule residentData={residentData} residentInfo={residentInfo} />
                        }
                        {!!residentData &&
                            <EPASpeedInfo
                                residentData={residentData}
                                residentInfo={residentInfo}
                                expiredResidentData={expiredResidentData}
                                residentFilter={residentFilter} />}

                        {!smallScreen && <CiteScoreGraph width={widthOfRoot / 2} citeScoreData={citeScoreData} />}
                        {!smallScreen && <OralScoreGraph width={widthOfRoot / 2} oralScoreData={oralScoreData} />}
                        {!smallScreen && <RecentEPATrend width={widthOfRoot / 2} residentData={residentData} />}
                        {!smallScreen &&
                            <NarrativeBlock
                                width={widthOfRoot / 2}
                                narrativeData={narrativeData}
                                residentFilter={residentFilter} />}

                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        residentData: state.oracle.residentData,
        narrativeData: state.oracle.narrativeData,
        expiredResidentData: state.oracle.expiredResidentData,
        residentFilter: state.oracle.residentFilter,
        residentList: state.oracle.residentList
    };
}

export default connect(mapStateToProps, null)(InfoPanel);
