import React, { Component } from 'react';
import LineChart from './LineChart';
import { scaleLinear } from 'd3';
import SlideInTable from './SlideInTable';
import SlideInFilter from './SlideInFilter';
import oScoreReference from "../../../utils/oScoreReference";
import ReactTooltip from 'react-tooltip';

export default class GraphRow extends Component {

    constructor(props) {
        super(props);
        this.state = { filterDict: {} };
        this.onHighlightChange = this.onHighlightChange.bind(this);
    }

    onHighlightChange(filterKey, filterValue) {
        if (filterKey === '*') {
            this.setState({ filterDict: filterValue });
        } else {
            this.state.filterDict[filterKey] = filterValue;
            const filterDict = this.state.filterDict;
            this.setState({ filterDict });
        }
    }

    render() {

        const { filterDict } = this.state;

        let { epaSource, widthPartition, smallScreen,
            residentEPAData, onMouseOut, onMouseOver, isAllData } = this.props;

        // margin of 10px on either side reduces the available width by 20
        let marginVertical = 25, marginHorizontal = 35,
            height = 250, innerHeight = height - 50,
            width = (smallScreen ? widthPartition : widthPartition * 4) - 40;

        // create a unique EPA ID class based on epa source and form
        const epaIDClass = 'epa-' + '-' + epaSource.split('.').join('-');

        // Get the record rating scale
        let scoreScale = residentEPAData.length > 0 ? residentEPAData[0].scale : oScoreReference;


        // map the form ID for the corresponding contextual variable map
        const contextual_variable_map = _.flatMap(window.dynamicDashboard.contextual_variable_map),
            filterOptions = convertToFilterDict(contextual_variable_map, filterDict);


        // For Family Medicine since there is only one form and too many data points
        // filtering works a bit differently. Instead of Highlighting data points that match the filter and date criteria we remove them
        // so we maintain two arrays an original copy and a filtered copy 

        // remove records that dont fall in the selected time period 
        const dateFilteredData = isAllData ? _.clone(residentEPAData) : _.filter(residentEPAData, e => e.mark);

        let dateAndCVFilteredData = _.clone(dateFilteredData);

        let isAnyFilterActive = !_.isEmpty(_.flatMap(filterDict));

        // If Filter Dictionary is available
        if (isAnyFilterActive) {
            dateAndCVFilteredData = _.filter(dateFilteredData, (d, i) => {

                let matchesCVArray = [];
                const contexts = d.situationContextCollection || [];

                // For every active CV filter we store a matching or mismatching flag
                // and then in the end we "and" gate them so a record is considering matching only if it matches everything
                for (const filter of Object.keys(filterDict)) {
                    if (filter && filterDict[filter] && filterDict[filter].length > 0) {

                        let matchesCV = false;
                        let relaventContext = _.find(contexts, (d) => d.item_text == filter);
                        if (relaventContext && relaventContext.text) {
                            matchesCV = (filterDict[filter].indexOf(relaventContext.text) > -1);
                        }
                        matchesCVArray.push(matchesCV);
                    }
                }

                return matchesCVArray.length > 0 ? _.reduce(matchesCVArray, (a, b) => a && b, true) : false;
            });
        }


        const xScale = scaleLinear().domain([0, dateAndCVFilteredData.length - 1]).range([marginHorizontal + 20, width - marginHorizontal]),
            yScale = scaleLinear().domain([scoreScale.length, 1]).range([marginVertical, innerHeight - marginVertical]);

        const scoreData = dateAndCVFilteredData.map((d, i) => {
            return {
                x: xScale(i),
                y: yScale(d.Rating),
                recordID: d.recordID,
                pureData: d,
                concern: d.concernFlagged
            };
        });





        const trackTrailPositions = _.map(scoreScale, (d, i) => {
            return {
                x: marginHorizontal + 20,
                dx: width - (2 * marginHorizontal) - 20,
                y: yScale(i + 1)
            }
        });

        const legends = _.map(scoreScale, (d, i) => {
            return {
                x: marginHorizontal,
                y: yScale(i + 1),
                labelID: i + 1,
                label: d
            }
        });


        return (
            <div className={'form-wrapper ' + 'wrapper-' + epaIDClass}>
                <SlideInFilter
                    data={dateFilteredData}
                    width={width}
                    epaSource={epaSource}
                    onHighlightChange={this.onHighlightChange}
                    filterDict={filterDict}
                    filterOptions={filterOptions} />

                {isAnyFilterActive && <h4 className='m-t-0'>Field Note Count (matching all selected filters) : {scoreData.length}</h4>}
                <LineChart
                    trackTrailPositions={trackTrailPositions}
                    legends={legends}
                    width={width}
                    data={scoreData}
                    scoreScale={scoreScale}
                    epaIDClass={epaIDClass}
                    smallScreen={smallScreen}
                    innerHeight={innerHeight}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut} />
                <SlideInTable
                    data={dateAndCVFilteredData}
                    width={width} />
                <ReactTooltip id={'epa-buttontip-' + epaIDClass} delayShow={500} className='custom-react-tooltip' />
            </div>
        );
    }
}



// This takes in values that are in contextual variable map format
// of elentra and converts them into a more easily consumable form needed for the dashboard
// as a array of options with a title
function convertToFilterDict(contextual_variable_map, filterDict) {

    //  Since for Family Medicine we are combing CVs from different forms,
    // we need to group all the CV responses in the same parent by their objective ID and then just pick one from each list 
    // to ensure there are no duplicates 
    let contextual_variables = _.map(_.groupBy(contextual_variable_map, (d) => d.objective_id), e => e[0]);

    // then we process them the same as earlier 
    let filterGroup = _.groupBy(contextual_variables, (d) => d.objective_parent_name);

    // set the options simply as the obective title
    return _.map(filterGroup, (options, filterKey) => {
        return {
            'label': filterKey,
            'options': _.map(options, (d) => d.objective_name),
            'selected': filterDict[filterKey] || ''
        };
    });
}

