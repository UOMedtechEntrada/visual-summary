import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
class HeaderRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { onStageLabelClick, innerKey, isCurrentSubRootVisible,
            epaSourceMap, residentList, residentFilter, t, residentEPAData } = this.props;
        let requiredEPACount = 0, achievedEPACount = 0, residentInfo;

        _.map(epaSourceMap.maxObservation, (count, epaID) => {
            requiredEPACount += count;
            const achievedCount = +epaSourceMap.achieved[epaID];
            // reset the completed to max amount
            achievedEPACount += Math.min(achievedCount ? achievedCount : 0, count);
        });

        // Get recorded observation count
        const recordedEPAs = _.filter(_.flatMap(residentEPAData),e=>e.EPA.split(".")[0]==innerKey);

        // If all the sub EPAs in a stage are marked complete,
        // then mark the stage as complete
        let allSubEPAsComplete = _.reduce(epaSourceMap.completed, (acc, d) => acc && d, true);

        if (residentFilter && residentFilter.username) {
            residentInfo = _.find(residentList, (resident) => resident.username == residentFilter.username);
            if (residentInfo.currentPhase) {
                switch (residentInfo.currentPhase) {
                    case 'transition-to-discipline': currentPhase = 1; break;
                    case 'foundations-of-discipline': currentPhase = 2; break;
                    case 'core-discipline': currentPhase = 3; break;
                    case 'transition-to-practice': currentPhase = 4; break;
                }
            }
        }

        // TODO remap stages as sequential array instead of object so ordering doesnt screw things up
        // From dashboard options get the training stages and get the stage id of the current training stage
        let { dashboard_stages = [] } = dashboard_options,
            currentStage = dashboard_stages[+innerKey - 1] || { 'target_id': '' },
            currentStageStatus = {};
        // set the value only if it has been defined
        if (residentInfo.stageProgress && residentInfo.stageProgress[currentStage.target_id]) {
            currentStageStatus = residentInfo.stageProgress[currentStage.target_id];
        }

        let percentageComplete = Math.round((achievedEPACount * 100) / requiredEPACount),
            statusLabel, iconLabel;

        // remap NaN values to 0
        percentageComplete = isNaN(percentageComplete) ? 0 : percentageComplete;

        if (currentStageStatus.completed || allSubEPAsComplete) {
            iconLabel = 'fa-check-circle';
            statusLabel = t('Complete');
            percentageComplete = '';
        }
        else if (currentStageStatus.in_progress || percentageComplete > 0) {
            iconLabel = 'fa-hourglass-half';
            statusLabel = t('In Progress');
            percentageComplete += '%';
        }
        else if (recordedEPAs.length > 0) {
            iconLabel = 'fa-hourglass-half';
            statusLabel = t('In Progress');
            percentageComplete = '';
        }
        else {
            iconLabel = 'fa-flag-checkered';
            statusLabel = t('Not Started');
            percentageComplete = '';
        }

        return (
            <div className={'text-xs-center text-sm-left inner-epa-head' + (isCurrentSubRootVisible ? ' bottom-line ' : ' ') + 'label-index-' + innerKey} onClick={onStageLabelClick}>
                {isCurrentSubRootVisible ? <span className="fa fa-chevron-down"></span> : <span className="fa fa-chevron-right"></span>}
                <span className='epa-label' >{epaSourceMap.topic}</span>
                <span className='epa-label-status' >{statusLabel}<span className={"fa " + iconLabel}></span> {percentageComplete}</span>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        residentFilter: state.oracle.residentFilter,
        residentList: state.oracle.residentList,

    };
}

export default withTranslation()(connect(mapStateToProps, null)(HeaderRow));