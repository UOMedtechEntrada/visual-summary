import React, { Component } from 'react';
import ReactSelect from 'react-select';
import processSingleProgramRecords from '../../utils/processSingleProgramRecords';
import Summary from './ProgramSummary';
import EPAspecificRotation from './EPAspecificRotation';
import RotationSpecificEPA from './RotationSpecificEPA';
import EPAOverallbyRotation from './EPAOverallbyRotation';
import infoTooltipReference from '../../utils/infoTooltipReference';
import ReactTooltip from 'react-tooltip';

export default class ProgramBasePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            academicYear: -1,
            trainingStage: 'A',
            rotationCount: {}
        };
    }

    onSelectAcademicYear = (academicYear) => {
        this.setState({ 'academicYear': _.findIndex(this.props.possibleAcademicYears, (d) => d.value == academicYear.value) });
    }

    render() {

        let { allRecords, possibleAcademicYears, width, epa_list } = this.props, { academicYear } = this.state;
        // keep the default the most recent academic year
        if (academicYear == -1) {
            academicYear = possibleAcademicYears.length - 1;
        }

        const selectedAcademicYear = possibleAcademicYears[academicYear];

        const { recordsInYearAndPhase, summaryData } = processSingleProgramRecords(allRecords, selectedAcademicYear);

        return (
            <div className='program-base-panel text-center'>
                <div className='row'>

                    <div className="hr-divider">
                        <h4
                            className="hr-divider-content">
                            Overall Acquisition Metrics for Year - {selectedAcademicYear.value}
                            <i data-for={'overallAcuisitionMetricsbyYear'} data-tip={infoTooltipReference.programEvaluation.overallAcuisitionMetricsbyYear} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        </h4>
                        <ReactTooltip id={'overallAcuisitionMetricsbyYear'} className='custom-react-tooltip' />
                    </div>

                    <div className='year-selection-box'>
                        <h2 className='header'>Academic Year: </h2>
                        <div className='react-select-root'>
                            <ReactSelect
                                value={selectedAcademicYear}
                                options={possibleAcademicYears}
                                styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                                onChange={this.onSelectAcademicYear} />
                        </div>
                    </div>
                </div>
                <div className='row m-t'>
                    <Summary data={summaryData} possibleAcademicYears={possibleAcademicYears} />
                    <EPAOverallbyRotation
                        // 40px to account for margin around the boxes above
                        width={(width)}
                        allRecords={recordsInYearAndPhase} />
                </div>
            </div>
        );
    }
}



