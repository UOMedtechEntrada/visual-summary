import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NormativeTable, NormativeFilterPanel, NormativeGraph } from '../';
import ReactTooltip from 'react-tooltip';
import { withTranslation } from "react-i18next";
class NormativeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStage: 'all-training-stages',
            removeNoRecords: true
        };
    }

    onStageChange = (stage) => { this.setState({ 'currentStage': stage.value }) };
    onNoRecordChange = (event) => { this.setState({ 'removeNoRecords': event.target.checked }) };

    render() {

        const { residentList, isUG, t } = this.props, { currentStage, removeNoRecords } = this.state;

        const residentsInPhase = (currentStage == 'all-training-stages') ? residentList :
            _.filter(residentList, (res) => res['currentPhase'] == currentStage);

        const filteredList = removeNoRecords ?
            _.filter(residentsInPhase, (d) => d['totalAssessments'] > 0) : residentsInPhase;

        const overallWidth = window.dynamicDashboard.mountWidth;

        let tableWidth = 450, graphMountWidth = overallWidth - tableWidth, smallScreen = false;
        // If the graph width is less than the radio button bar above it, span it to the full width and expand the table
        if (graphMountWidth < 660) {
            graphMountWidth = tableWidth = overallWidth - 75;
            smallScreen = true;
        }

        return (
            <div className='normative-data-container'>
                <div className='text-center'>
                    <NormativeFilterPanel
                        isUG={isUG}
                        currentStage={currentStage}
                        removeNoRecords={removeNoRecords}
                        onStageChange={this.onStageChange}
                        onNoRecordChange={this.onNoRecordChange} />
                    {filteredList.length > 0 ?
                        <div className='normative-inner-root'>
                            <NormativeGraph
                                width={graphMountWidth}
                                records={filteredList} />
                            <NormativeTable
                                width={tableWidth}
                                smallScreen={smallScreen}
                                records={filteredList} />
                        </div> :
                        <h3 className='text-primary text-center m-t-lg'>
                            {t("Sorry there are no learners in the selected training stage.")}
                        </h3>}
                    <ReactTooltip className='custom-react-tooltip' id='normative-instant-info' />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        residentList: state.oracle.residentList
    };
}

export default withTranslation()(connect(mapStateToProps, {})(NormativeDashboard));