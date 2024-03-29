import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showTooltip, setLevelVisibilityStatus } from '../../../redux/actions/actions';
import GraphRow from './GraphRow';
import HeaderRow from './HeaderRow';
import Tooltip from './Tooltip';
import { NumberToEPAText } from '../../../utils/convertEPA';
import _ from 'lodash';
import { withTranslation } from "react-i18next";

class GraphPanel extends Component {

    constructor(props) {
        super(props);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onStageLabelClick = this.onStageLabelClick.bind(this);
        this.onInfoClick = this.onInfoClick.bind(this);
        this.onTableExpandClick = this.onTableExpandClick.bind(this);
        this.onFilterExpandClick = this.onFilterExpandClick.bind(this);
        this.state = {
            openTableID: '',
            openFilterID: ''
        };
    }

    onInfoClick(event) {

        const { programInfo } = this.props, { epaSourceMap } = programInfo;

        event.stopPropagation();

        // add in information about the EPA
        const classID = event.target.className.split(" ")[4],
            // remove "epa-formid-" and then convert 1-1 to 1.1
            epaSource = classID.split('-').slice(2).join('.');
        // Get the objectiveID from source MAP *
        const objectiveId = epaSourceMap[epaSource.split(".")[0]].objectiveID[epaSource];
        // populate other info
        let proxyId = this.props.residentFilter.username;
        let courseId = course_id;
        let epa = NumberToEPAText(epaSource.trim());
        let options = {
            firstName: '',
            lastName: '',
            titlePrepend: epa,
            container: '.wrapper-' + classID,
            placement: 'left',
            // remove any attached popovers from DOM
            onDestroy: () => { jQuery('.popover').remove() }
        }
        new ObjectiveRequirementDisplay(jQuery(document.getElementById('info-' + classID)), proxyId, courseId, objectiveId, options);
    }

    onStageLabelClick(event) {
        const clickedID = +event.currentTarget.className.split('label-index-')[1];
        let visibilityOpenStatus = { ...this.props.levelVisibilityOpenStatus };
        visibilityOpenStatus[clickedID] = !visibilityOpenStatus[clickedID];
        this.props.actions.setLevelVisibilityStatus(visibilityOpenStatus);
        this.setState({ openTableID: '' });
    }

    onTableExpandClick(event) {
        const classID = event.target.className.split(" ")[4],
            // remove "epa-"
            openTableID = classID.slice(4);
        // if already open close it , if not open it !
        if (event.target.className.indexOf('open-table') > -1) {
            this.setState({ openTableID: '', openFilterID: '' });
        }
        else {
            this.setState({ openTableID, openFilterID: '' });
        }
    }
    onFilterExpandClick(event) {
        const classID = event.target.className.split(" ")[4],
            // remove "epa-" 
            openFilterID = classID.slice(4);
        // if already open close it , if not open it !
        if (event.target.className.indexOf('open-filter') > -1) {
            this.setState({ openFilterID: '', openTableID: '' });
        }
        else {
            this.setState({ openFilterID, openTableID: '' });
        }
    }

    onMouseOver(event) {
        let { residentData, actions } = this.props;
        let pointId = event.target.id.split("-");
        let dataList = residentData[pointId[4] + '.' + pointId[5]],
            dataGroupedByForm = _.groupBy(dataList, (d) => d.formID),
            data = dataGroupedByForm[pointId[3]][pointId[7]],
            pageWidth = window.dynamicDashboard.mountWidth;

        actions.showTooltip(true, {
            'x': event.pageX + 410 > pageWidth ? event.pageX - 410 : event.pageX + 10,
            'y': event.pageY - 50,
            // Add an empty line to align info horizontally
            'comments': data['Feedback'] ? '\n' + data['Feedback'] : '',
            'name': data['Assessor_Name'],
            'group': data['Assessor_Group'],
            'type': data['Type'],
            'date': data['Date'],
            // Add an empty line to align info horizontally
            'context': '\n' + data['Situation_Context'],
            // show safety concerns in the tooltip only if they are non empty and not "No"
            "concern": (data['Professionalism_Safety'] != 0 && data['Professionalism_Safety'] != "No") ? data['Professionalism_Safety'] : ''
        });

    }

    onMouseOut(event) {
        this.props.actions.showTooltip(false);
    }

    render() {

        let { residentData, residentFilter = {},
            isTooltipVisible,
            tooltipData, smallScreen, width,
            levelVisibilityOpenStatus, programInfo = {}, t } = this.props;

        const { openTableID, openFilterID } = this.state;

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

                    {/* code chunk for displaying titles above the table */}
                    <div className='title-root text-xs-center'>
                        <h4 style={{ width: widthPartition }} className='title-bar'>{t("EPA(Entrustable Professional Activity)")}</h4>
                        <h4 style={{ width: widthPartition }} className='title-bar'>{t("Observation Count")}</h4>
                        <h4 style={{ width: smallScreen ? widthPartition : widthPartition * 2 }} className='title-bar'>{t("Score History")}</h4>
                    </div>

                    {/* This is the main container which houses the table contents */}
                    <div style={{ width: widthOfRootGraphPanel }} className='panel-inner-root'>
                        {_.map(epaSourcesThatExist, (epaSources, innerKey) => {

                            let isCurrentSubRootVisible = levelVisibilityOpenStatus[innerKey],
                                epaSpecificSourceMap = epaSourceMap[innerKey] || {
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

                                    {/* EPA Label Row head that can be clicked to expand or collapse */}
                                    <HeaderRow
                                        onStageLabelClick={this.onStageLabelClick}
                                        innerKey={innerKey}
                                        smallScreen={smallScreen}
                                        isCurrentSubRootVisible={isCurrentSubRootVisible}
                                        epaSourceMap={epaSpecificSourceMap}
                                        residentEPAData={residentData}
                                         />

                                    {/* Actual Row data containing labels and bullet and line charts */}
                                    <div className={'inner-graph-row ' + (isCurrentSubRootVisible ? 'show-row' : 'hide-row')}>
                                        {_.map(epaSources, (epaSource, sourceKey) => {
                                            return (
                                                <GraphRow
                                                    key={'inner-row-' + sourceKey}
                                                    innerKey={innerKey}
                                                    epaSource={epaSource}
                                                    openTableID={openTableID}
                                                    openFilterID={openFilterID}
                                                    widthPartition={widthPartition}
                                                    epaSourceMap={epaSpecificSourceMap}
                                                    smallScreen={smallScreen}
                                                    residentEPAData={residentData[epaSource] || []}
                                                    onMouseOver={this.onMouseOver}
                                                    onMouseOut={this.onMouseOut}
                                                    onInfoClick={this.onInfoClick}
                                                    onTableExpandClick={this.onTableExpandClick}
                                                    onFilterExpandClick={this.onFilterExpandClick} />)
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(GraphPanel));
