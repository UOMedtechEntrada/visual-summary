import React, { Component } from 'react';
import processOversightRecords from '../../utils/processors/processOversightRecords';
import { Line, LineChart, ReferenceLine, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
import { t } from 'i18next';
import getRatingScale from '../../utils/getRatingScale';
import downloadCSV from '../../utils/downloadCSV';

const defaultColors = ["#e15759", "#f28e2c"];
const monthList = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];


class ProgramsSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            summaryData: []
        }
    }

    componentDidMount() {
        const { programList, academicYear, t } = this.props;
        let summaryData = [];
        _.map(programList,
            (program) => summaryData.push(processOversightRecords(window.global_summary[program.value], academicYear)['summaryData']));
        this.setState({ summaryData });
    }

    downloadReport = () => {

        const { programList, academicYear, t } = this.props, { summaryData = [] } = this.state,
            { ratingScale } = getRatingScale(window.mostCommonScaleRatings.length),
            custom_data = _.map(summaryData, (d, programIndex) => {

                let ratingGroupSum = _.sum(d.rating_group),
                    normalisedRatingGroup = _.map(d.rating_group, e => parseFloat(Math.round((e * 1000) / (ratingGroupSum || 1)) / 10) + '%');

                return {
                    'program': programList[programIndex].label,
                    'resident_count': d.resident_count,
                    'rating_group': normalisedRatingGroup,
                    [t('EPAs Acquired')]: d.epa_count,
                    [t('EPAs Expired')]: d.expired_count,
                    [t('EPAs Acquired/Learner')]: d.epa_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('EPAs Expired/Learner')]: d.expired_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('Mean Words Per Comment')]: d.words_per_comment,
                    'month_count': d.month_count,
                    'expired_month_count': d.expired_month_count,
                }
            });

        const acquiredMonthList = monthList.map(e => e + "(Acquired)"),
            expiredMonthList = monthList.map(e => e + "(Expired)");

        if (custom_data.length > 0) {

            const csvLabels = [
                'Academic Year',
                'Program',
                'Resident Count',
                'Total EPAs Acquired',
                'Total EPAs Expired',
                'EPAs Acquired/Learner',
                'EPAs Expired/Learner',
                'Mean Words Per Comment',
                ...ratingScale,
                ...acquiredMonthList,
                ...expiredMonthList];

            const csvValues = _.map(custom_data, e => {

                const ratingValues = _.map(e.rating_group, f => f),
                    monthlyValues = _.map(monthList, m => e.month_count[m] || 0),
                    monthlyExpiredValues = _.map(monthList, m => e.expired_month_count[m] || 0);

                return [
                    academicYear.label,
                    e['program'],
                    e['resident_count'],
                    e[t('EPAs Acquired')],
                    e[t('EPAs Expired')],
                    e[t('EPAs Acquired/Learner')],
                    e[t('EPAs Expired/Learner')],
                    e[t('Mean Words Per Comment')],
                    ...ratingValues,
                    ...monthlyValues,
                    ...monthlyExpiredValues
                ]

            });

            downloadCSV(csvLabels, csvValues, 'program-oversight-data-report');
        }

    }


    render() {
        const { width, programList, t } = this.props,
            { summaryData } = this.state,
            custom_data = _.map(summaryData, (d, programIndex) => {
                return {
                    'program': programList[programIndex].label,
                    'resident_count': d.resident_count,
                    'rating_group': d.rating_group,
                    [t('EPAs Acquired')]: d.epa_count,
                    [t('EPAs Expired')]: d.expired_count,
                    [t('EPAs Acquired/Learner')]: d.epa_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('EPAs Expired/Learner')]: d.expired_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('Mean Words Per Comment')]: d.words_per_comment,
                    'month_count': d.month_count,
                    'expired_month_count': d.expired_month_count,
                }
            });


        const averegeEPAperResident = _.meanBy(custom_data, d => d[t('EPAs Acquired/Learner')]),
            averegeWordsPerComment = _.meanBy(custom_data, d => d[t('Mean Words Per Comment')]);

        const { colorScale, ratingScale } = getRatingScale(window.mostCommonScaleRatings.length);

        const ratingDataList = _.map(custom_data, (d) => {
            const total = _.sum(d.rating_group);
            let dataPoint = { 'program': d.program };
            _.map(ratingScale, (rating, index) => {
                dataPoint[rating] = total == 0 ? 0 : (d.rating_group[index] / total) * 100;
            });
            return dataPoint;
        });

        return (
            <div className={'yearall-summary-wrapper m-b'}>

                <div className='text-right m-r-md m-t-md'>
                    <button onClick={this.downloadReport} className='btn btn btn-primary-outline'> <i className="fa fa-download"></i>
                        {" " + t("Export Program Data")}
                    </button>
                </div>

                <div className="hr-divider">
                    <h4 className="hr-divider-content">
                        {t("Overall Acquisition Metrics")}
                        <i data-for={'overallAcuisitionMetricsYears'} data-tip={t("programEvaluation-overallAcuisitionMetricsYears")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    </h4>
                    <ReactTooltip id={'overallAcuisitionMetricsYears'} className='custom-react-tooltip' />
                </div>
                <div className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("EPAs Acquired")}
                        <i data-for={'EPAsAcquiredAndExpired'} data-tip={t("programOversight-EPAsAcquiredAndExpired")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAsAcquiredAndExpired'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={675}
                            data={custom_data}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'8%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 30 }}>
                            <XAxis style={{ fill: 'black', 'fontWeight': 'bolder' }}
                                type="number" />
                            <YAxis width={125} tickSize={0} tickMargin={5} type="category" axisLine={false} dataKey="program" />
                            <Tooltip labelStyle={{ 'color': 'black' }}
                                wrapperStyle={{ 'fontWeight': 'bold' }}
                                formatter={(value, name, props) => {
                                    return [Math.round(value), name];
                                }} />
                            <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                            <Bar dataKey={t("EPAs Acquired")} fill="#82ca9d" />
                            <Bar dataKey={t("EPAs Expired")} fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>

                <div className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("EPAs Acquired Per Learner")}
                        <i data-for={'EPAsAcquiredAndExpired'} data-tip={t("programOversight-EPAsAcquiredAndExpiredPerResident")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAsAcquiredAndExpired'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={675}
                            data={custom_data}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'8%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 30 }}>
                            <XAxis style={{ fill: 'black', 'fontWeight': 'bolder' }}
                                type="number" />
                            <YAxis width={125} tickSize={0} tickMargin={5} type="category" axisLine={false} dataKey="program" />
                            <Tooltip labelStyle={{ 'color': 'black' }}
                                wrapperStyle={{ 'fontWeight': 'bold' }}
                                formatter={(value, name, props) => {
                                    return [Math.round(value) + ' per Resident' + " (" + (props.payload.resident_count) + ' Residents)', name];
                                }} />
                            <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                            <Bar dataKey={t("EPAs Acquired/Learner")} fill="#82ca9d" />
                            <Bar dataKey={t("EPAs Expired/Learner")} fill="#8884d8" />
                            <ReferenceLine x={averegeEPAperResident} stroke="#82ca9d" strokeWidth='2' strokeDasharray="3 3" />
                        </BarChart>
                    </div>
                </div>
                <div className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("EPA Rating Distribution")}
                        <i data-for={'EPARatingDistribution'} data-tip={t("programEvaluation-EPARatingDistribution")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPARatingDistribution'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={675}
                            data={ratingDataList}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'8%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 30 }}>
                            <XAxis tickFormatter={(value) => Math.round(value)} style={{ fill: 'black', 'fontWeight': 'bolder' }} type="number" domain={[0, 100]} />
                            <YAxis style={{ 'fontWeight': 'light' }} width={125} tickSize={0} tickMargin={5} type="category" axisLine={false} dataKey="program" />
                            <Tooltip labelStyle={{ 'color': 'black' }} wrapperStyle={{ 'fontWeight': 'bold' }}
                                formatter={(value, name) => ([(Math.round(value * 10) / 10) + '%', name])} />
                            <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                            {_.map(ratingScale, (rating, index) => {
                                return <Bar key={'stacked-rating-' + index} stackId='a' dataKey={rating} fill={colorScale[index]} />
                            })}
                        </BarChart>
                    </div>
                </div>
                <div
                    className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("Mean Words Per Comment")}
                        <i data-for={'EPAFeedbackWordCount'} data-tip={t("programOversight-EPAFeedbackWordCount")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAFeedbackWordCount'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={675}
                            data={custom_data}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'8%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 10 }}>
                            <XAxis style={{ fill: 'black', 'fontWeight': 'bolder' }}
                                type="number" />
                            <YAxis width={125} tickSize={0} tickMargin={5}
                                type="category" axisLine={false} dataKey="program" />
                            <Tooltip labelStyle={{ 'color': 'black' }}
                                wrapperStyle={{ 'fontWeight': 'bold' }} />
                            <Bar dataKey={t("Mean Words Per Comment")} fill="#43b98e" />
                            <ReferenceLine x={averegeWordsPerComment} stroke="#82ca9d" strokeWidth='2' strokeDasharray="3 3" />
                        </BarChart>
                    </div>
                </div>


                <div className="hr-divider p-t-lg">
                    <h4 className="hr-divider-content">
                        {t("Monthly Distribution")}
                        <i data-for={'overallAcuisitionMetricsYears'} data-tip={t("programOversight-monthlyMetrics")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    </h4>
                </div>
                {_.map(custom_data, (p, pID) => {

                    const monthCountList = _.map(monthList, (month) => {
                        let dataPoint = { month };
                        dataPoint[t('EPAs Acquired')] = p.month_count[month] || 0
                        dataPoint[t('EPAs Expired')] = p.expired_month_count[month] || 0
                        return dataPoint;
                    });

                    return <div key={'monthly-chart-wrapper-' + pID} className='program-part-container p-b' >
                        <div className='chart-container'>
                            <h4 className='p-a text-center'>{p.program}</h4>
                            <LineChart width={(width / 3) * 0.95}
                                height={300} data={monthCountList}
                                margin={{ left: 25, right: 30, top: 15, bottom: 30 }}>
                                <XAxis style={{ 'fontWeight': 'bolder' }}
                                    width={10} tickSize={0} tickMargin={10}
                                    type="category" dataKey="month" />
                                <YAxis width={15} />
                                <Tooltip labelStyle={{ 'color': 'black' }} wrapperStyle={{ 'fontWeight': 'bold' }} />
                                <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                                <Line
                                    type="monotone"
                                    key={'monthly-program-' + pID}
                                    dataKey={t('EPAs Acquired')}
                                    stroke={defaultColors[0]}
                                    strokeWidth={3} />
                                <Line
                                    type="monotone"
                                    key={'monthly-program-expired-' + pID}
                                    dataKey={t('EPAs Expired')}
                                    stroke={defaultColors[1]}
                                    strokeWidth={3} />
                            </LineChart>
                        </div>
                    </div>;
                })}
            </div>
        );
    }
}

export default withTranslation()(ProgramsSummary);

