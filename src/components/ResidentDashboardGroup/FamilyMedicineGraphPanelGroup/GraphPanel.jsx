import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showTooltip, setLevelVisibilityStatus } from '../../../redux/actions/actions';
import GraphRow from './GraphRow';
import Tooltip from './Tooltip';


class GraphPanel extends Component {

    constructor(props) {
        super(props);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }
    onMouseOver(event) {
        let { residentData, actions } = this.props;
        let pointId = event.target.id.split("-");
        let dataList = residentData[pointId[4] + '.' + pointId[5]],
            data = _.find(dataList, d => d.recordID == pointId[7]),
            pageWidth = window.dynamicDashboard.mountWidth;

        actions.showTooltip(true, {
            'x': event.pageX + 400 > pageWidth ? event.pageX - 400 : event.pageX,
            'y': event.pageY - 50,
            // Add an empty line to align info horizontally
            'comments': data['Feedback'] ? '\n' + data['Feedback'] : '',
            'name': data['Assessor_Name'],
            'group': data['Assessor_Group'],
            'type': data['Type'],
            'date': data['Date'],
            // Add an empty line to align info horizontally
            'context': '\n' + data['Situation_Context']
        });

    }

    onMouseOut(event) {
        this.props.actions.showTooltip(false);
    }

    render() {

        let { residentData, residentFilter = {},
            isTooltipVisible,
            tooltipData, smallScreen, width, programInfo = {} } = this.props;

        const { isAllData = true, hideNoDataEPAs = false } = residentFilter;

        // populate the source map from the program info
        let epaSourceMap = programInfo.epaSourceMap;

        // if no data then set flag to false if not group data by root key
        let epaSourcesThatExist = false;
        if (residentData && Object.keys(residentData).length > 0) {
            epaSourcesThatExist = _.groupBy(Object.keys(residentData), (key) => { return key.split('.')[0] });
            // sort the values 
            _.map(epaSourcesThatExist, (epaSource) => {
                epaSource.sort((a, b) => Number(a.split(".")[1]) - Number(b.split(".")[1]));
            });
            // remove values that dont exist in the original source map 
            _.map(epaSourcesThatExist, (epaSource, epaRootKey) => {

                const mappedStageList = epaSource.filter((d) => {
                    const sourceMapExists = epaSourceMap[epaRootKey].subRoot.hasOwnProperty(d);
                    const noMarkedData = _.filter(residentData[d] || [], (e) => e.mark).length == 0;
                    // if the hide filter is on and no marked data exists remove the source by filtering it out
                    if (!isAllData && hideNoDataEPAs && noMarkedData) return false;
                    return sourceMapExists;
                });

                // After the filtering is done,
                // if a stage is empty remove it
                if (mappedStageList.length > 0) {
                    epaSourcesThatExist[epaRootKey] = mappedStageList;
                }
                else {
                    delete epaSourcesThatExist[epaRootKey];
                }

            });
        }

        let widthOfRootGraphPanel = smallScreen ? (width + 50) : width;
        let widthPartition = smallScreen ? (width - 20) : (width / 4);

        return (
            <div>
                {epaSourcesThatExist && <div className='graph-panel-root'>

                    {/* code chunk to show tooltip*/}
                    {isTooltipVisible && <Tooltip {...tooltipData} />}

                    {/* This is the main container which houses the table contents */}
                    <div style={{ width: widthOfRootGraphPanel }} className='panel-inner-root'>
                        {_.map(epaSourcesThatExist, (epaSources, innerKey) => {

                            let epaSpecificSourceMap = epaSourceMap[innerKey] || {
                                'ID': 'N/A',
                                'topic': 'N/A',
                                subRoot: {},
                                maxObservation: {},
                                observed: {},
                                completed: {},
                                achieved: {},
                                objectiveID: {},
                                assessmentInfo: {},
                                filterValuesDict: {}
                            };

                            return (
                                <div className="inner-sub-root" key={'sub-root-' + innerKey}>
                                    {/* Actual Row data containing labels and bullet and line charts */}
                                    <div className={'inner-graph-row show-row'}>
                                        {_.map(epaSources, (epaSource, sourceKey) => {
                                            return (
                                                <GraphRow
                                                    key={'inner-row-' + sourceKey}
                                                    isAllData={isAllData}
                                                    innerKey={innerKey}
                                                    epaSource={epaSource}
                                                    widthPartition={widthPartition}
                                                    epaSourceMap={epaSpecificSourceMap}
                                                    smallScreen={smallScreen}
                                                    residentEPAData={residentData[epaSource] || []}
                                                    onMouseOver={this.onMouseOver}
                                                    onMouseOut={this.onMouseOut} />)
                                        })}
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        residentData: state.oracle.residentData,
        isTooltipVisible: state.oracle.isTooltipVisible,
        tooltipData: state.oracle.tooltipData,
        levelVisibilityOpenStatus: state.oracle.visibilityOpenStatus,
        programInfo: state.oracle.programInfo ? state.oracle.programInfo : {}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            {
                showTooltip,
                setLevelVisibilityStatus
            }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphPanel);
