import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackTrails from '../GraphPanelGroup/TrackTrails';
import TrackLegend from '../GraphPanelGroup/TrackLegend';
import { line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { showTooltip } from '../../../redux/actions/actions';

class RecentEPAScaleChart extends Component {

    constructor(props) {
        super(props);
    }

    onMouseOver = (event) => {
        const { actions, programInfo, data } = this.props;

        let pointId = event.target.id.split("-")[3],
            dataPoint = data[pointId],
            tempEPA = dataPoint['EPA'].split("."),
            epaText = dataPoint['EPA'] + " - " + programInfo.epaSourceMap[tempEPA[0]].subRoot[dataPoint['EPA']];


        var pageWidth = window.dynamicDashboard.mountWidth;
        actions.showTooltip(true, {
            'x': event.pageX + 410 > pageWidth ? event.pageX - 410 : event.pageX + 10,
            'y': event.pageY - 50,
            'epa': epaText,
            // Add an empty line to align info horizontally
            'comments': dataPoint['Feedback'] ? '\n' + dataPoint['Feedback'] : '',
            'type': dataPoint['Type'],
            'name': dataPoint['Assessor_Name'],
            'group': dataPoint['Assessor_Group'],
            'date': dataPoint['Date'],
            // Add an empty line to align info horizontally
            'context': '\n' + dataPoint['Situation_Context']
        });

    }

    onMouseOut = (event) => {
        this.props.actions.showTooltip(false);
    }

    render() {

        const { data, width, scale, scaleKey, t } = this.props;

        const d3Line = line().x((d) => d.x).y((d) => d.y),
            innerHeight = 200,
            marginHorizontal = 25,
            marginVertical = 25,
            xScale = scaleLinear().domain([0, data.length - 1]).range([marginHorizontal + 20, width - marginHorizontal]),
            yScale = scaleLinear().domain([scale.length, 1]).range([marginVertical, innerHeight - marginVertical])


        const trackTrailPositions = _.map([...Array(scale.length)], (d, i) => {
            return {
                x: marginHorizontal + 20,
                dx: width - (2 * marginHorizontal) - 20,
                y: yScale(i + 1)
            }
        });
        const legends = _.map(scale, (d, i) => {
            return {
                x: marginHorizontal,
                y: yScale(i + 1),
                labelID: i + 1,
                label: d
            }
        });

        const pointList = data.map((d, i) => {
            return {
                x: xScale(i),
                y: yScale(d.Rating),
                pureData: d
            };
        });

        // if a record has been marked by the filterpanel it means it lies in
        // a date range selected by the user
        // so make it a diamond instead of a circle
        const elementList = _.map(pointList, (d, i) => {

            if (d.pureData.mark) {
                return <polygon
                    id={scaleKey + '-recentPoint-' + i}
                    className='score-point'
                    key={'recent-point-' + i}
                    fill={'white'}
                    stroke={'#252830'}
                    strokeWidth={3}
                    points={(d.x - 6) + "," + d.y + " " + d.x + "," + (d.y + 6) + " " + (d.x + 6) + "," + d.y + " " + (d.x) + "," + (d.y - 6) + " " + (d.x - 6) + "," + (d.y)}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut} />
            }

            return <circle
                id={scaleKey + '-recentPoint-' + i}
                className='score-point'
                key={'recent-point-' + i}
                fill={'#252830'}
                cx={d.x} cy={d.y} r={6}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}>
            </circle>
        });

        return (
            <div>
                <svg height={innerHeight} width={width} className='recent-svg' >
                    <g>
                        <TrackLegend legends={legends} />
                        <TrackTrails trackTrailPositions={trackTrailPositions} />
                        <path className='score-spark-line' d={d3Line(pointList)}></path>
                        {elementList}
                    </g>
                </svg>
            </div>

        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ showTooltip }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(RecentEPAScaleChart);




