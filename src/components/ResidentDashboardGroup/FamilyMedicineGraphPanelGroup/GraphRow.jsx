import React, { Component } from 'react';
import FormWrapper from './FormWrapper';
import _ from 'lodash';

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

        let { epaSource, widthPartition, smallScreen, isAllData, residentEPAData } = this.props;

        return (
            <div className='text-xs-center'>
                <div style={{ width: smallScreen ? widthPartition : widthPartition * 4 }} className='inner-cell score-cell'>
                    <FormWrapper
                        isAllData={isAllData}
                        epaSource={epaSource}
                        widthPartition={widthPartition}
                        smallScreen={smallScreen}
                        residentEPAData={residentEPAData}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut} />
                </div>
            </div>
        );
    }
}