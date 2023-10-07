import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import RecentEPAScaleChart from './RecentEPAScaleChart';
import { withTranslation } from "react-i18next";

class RecentEPATrend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterRange: '25'
        }
        this.setFilterRange = this.setFilterRange.bind(this);
    }

    setFilterRange(event) {
        event.preventDefault();
        this.setState({ filterRange: document.getElementById('recent-resident-data').value });
    }

    getDataList = () => {

        const { residentData = {} } = this.props, { filterRange } = this.state;

        // when the records are loaded up we flatten them 
        // then we sort them by date
        let temp = _.reverse(_.sortBy(_.flatMap(residentData), (d) => d.Date));

        if (filterRange.indexOf('month') > -1) {
            //  Get the records that fall in that X month period from now
            return _.reverse(temp.filter((d) => moment(d.Date, 'YYYY-MM-DD')
                .isAfter(moment().subtract(+filterRange.split('-')[0], 'month'))));
        }
        return _.reverse(temp.slice(0, +filterRange));
        // the records are returned reversed so they are sorted from oldest to newest 
    }


    render() {

        const dataList = this.getDataList(), { filterRange } = this.state, { width, programInfo, t } = this.props;

        // Find the different Scale Groups 
        const dataGroupedByScales = _.map(_.groupBy(dataList, d => d.scale.join(':::')), (data, s) => ({ 'scale': s.split(':::'), data }));

        return (
            <div className='recent-epa-container'>
                <div className="hr-divider">
                    <h4 className="hr-divider-content">
                        {t("RECENT EPAs")}
                        <i data-for='recent-infotip' data-tip={t("residentMetrics-recentEPAs")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    </h4>
                    <ReactTooltip id='recent-infotip' className='custom-react-tooltip' />
                </div>
                <div className='recent-range-selection'>
                    <div className='name-box'>
                        <label className='filter-label'>{t("Last")}</label>
                        <select id='recent-resident-data' defaultValue={filterRange} className="custom-select">
                            <option value='10'>10 {t("Records")}</option>
                            <option value='25'>25 {t("Records")}</option>
                            <option value='1-month'>1 {t("Month")}</option>
                            <option value='3-month'>3 {t("Month")}</option>
                        </select>
                        <button className={'btn btn-primary-outline'} onClick={this.setFilterRange}>
                            <span className="fa fa-play"></span>
                        </button>

                    </div>
                </div>
                <div style={{ 'width': width }}>
                    {dataGroupedByScales.length > 0 ?
                        (_.map(dataGroupedByScales, (e, scaleIndex) =>
                            <RecentEPAScaleChart
                                scaleTitle={e.data[0].scaleTitle}
                                key={'scale-' + scaleIndex}
                                scaleKey={'scale-' + scaleIndex}
                                programInfo={programInfo}
                                scale={[...e.scale]}
                                data={[...e.data]}
                                width={width} />)) :
                        <h4 className='text-center m-t m-b'>{t("No records available")}</h4>}
                </div>

            </div>)
    }
}


function mapStateToProps(state) {
    return {
        residentData: state.oracle.residentData
    };
}

export default withTranslation()(connect(mapStateToProps, {})(RecentEPATrend));









