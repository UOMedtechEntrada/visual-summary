import React, { Component } from 'react';
import processSingleProgramRecords from '../../utils/processors/processSingleProgramRecords';
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
import getRatingScale from '../../utils/getRatingScale';
const fivePointColorScale = ["#e15759", "#f28e2c", "#76b7b2", "#4e79a7", "#59a14f"];
const monthList = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
class ProgramAllYearSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const { width, possibleAcademicYears, allRecords, t } = this.props;
        let summaryData = [];
        _.map(possibleAcademicYears, (academicYear) => summaryData.push(processSingleProgramRecords(allRecords, academicYear)['summaryData']));
        let custom_data = _.map(summaryData, (d, yearIndex) => {
                return {
                    'year': possibleAcademicYears[yearIndex].label,
                    'resident_count': d.resident_count,
                    'rating_group': d.rating_group,
                    [t('EPAs Acquired')]: d.epa_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('EPAs Expired')]: d.expired_count / (d.resident_count != 0 ? d.resident_count : 1),
                    [t('Average Words Per Comment')]: d.words_per_comment,
                    'month_count': d.month_count
                }
            });

        const { colorScale, ratingScale } = getRatingScale(window.mostCommonScaleRatings.length);

        const ratingDataList = _.map(custom_data, (d) => {
            const total = _.sum(d.rating_group);
            let dataPoint = { 'year': d.year };
            _.map(ratingScale, (rating, index) => {
                dataPoint[rating] = total == 0 ? 0 : (d.rating_group[index] / total) * 100;
            });
            return dataPoint;
        });

        const monthCountList = _.map(monthList, (month) => {
            let dataPoint = { month };
            _.map(custom_data, (d) => {
                dataPoint[d.year] = d.month_count[month] || 0
            });
            return dataPoint;
        });

        return (
            <div
                className={'yearall-summary-wrapper m-b'}>
                <div className="hr-divider">
                    <h4 className="hr-divider-content">
                        {t("Overall Acquisition Metrics")}
                        <i data-for={'overallAcuisitionMetricsYears'} data-tip={t("programEvaluation-overallAcuisitionMetricsYears")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    </h4>
                    <ReactTooltip id={'overallAcuisitionMetricsYears'} className='custom-react-tooltip' />
                </div>
                <div className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("EPAs Acquired Per Learner")}
                        <i data-for={'EPAsAcquiredAndExpired'} data-tip={t("programEvaluation-EPAsAcquiredAndExpiredPerResident")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAsAcquiredAndExpired'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={300}
                            data={custom_data}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'20%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 30 }}>
                            <XAxis style={{ fill: 'black', 'fontWeight': 'bolder' }}
                                type="number" />
                            <YAxis style={{ 'fontWeight': 'bold' }}
                                width={105} tickSize={0} tickMargin={5} type="category" axisLine={false} dataKey="year" />
                            <Tooltip labelStyle={{ 'color': 'black' }}
                                wrapperStyle={{ 'fontWeight': 'bold' }}
                                formatter={(value, name, props) => {
                                    if (name == t('EPAs Acquired')) {
                                        return [Math.round(value) + ' per Resident' + " (" + (props.payload.resident_count) + ' Residents)', name];
                                    }
                                    else {
                                        return [Math.round(value) + ' per Resident', name];
                                    }
                                }} />
                            <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                            <Bar dataKey={t("EPAs Acquired")} fill="#82ca9d" />
                            <Bar dataKey={t("EPAs Expired")} fill="#8884d8" />
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
                        <BarChart width={width / 2} height={300}
                            data={ratingDataList}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'20%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 30 }}>
                            <XAxis tickFormatter={(value) => Math.round(value)} style={{ fill: 'black', 'fontWeight': 'bolder' }} type="number" domain={[0, 100]} />
                            <YAxis style={{ 'fontWeight': 'bold' }} width={105} tickSize={0} tickMargin={5} type="category" axisLine={false} dataKey="year" />
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
                    <h3 className="part-year-title">{t("Monthly Distribution")}
                        <i data-for={'EPAMonthlyDistribution'} data-tip={t("programEvaluation-EPAMonthlyDistribution")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAMonthlyDistribution'} className='custom-react-tooltip' />
                    </h3>
                    <div className='chart-container'>
                        <LineChart width={width / 2}
                            height={300} data={monthCountList}
                            margin={{ left: 25, right: 30, top: 15, bottom: 30 }}>
                            <XAxis style={{ 'fontWeight': 'bolder' }}
                                width={105} tickSize={0} tickMargin={10}
                                type="category" dataKey="month" />
                            <YAxis />
                            <Tooltip labelStyle={{ 'color': 'black' }} wrapperStyle={{ 'fontWeight': 'bold' }} />
                            <Legend wrapperStyle={{ bottom: 0 }} height={32} />
                            {_.map(possibleAcademicYears, (year, index) => {
                                return <Line
                                    type="monotone"
                                    key={'monthly-year-' + index}
                                    dataKey={year.label}
                                    // strokeOpacity={0.5}
                                    stroke={fivePointColorScale[index]}
                                    strokeWidth={3} />
                            })}
                        </LineChart>
                    </div>
                </div>
                <div
                    className='program-part-container p-b'>
                    <h3 className="part-year-title">
                        {t("Average Words Per Comment")}
                        <i data-for={'EPAFeedbackWordCount'} data-tip={t("programEvaluation-EPAFeedbackWordCount")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                        <ReactTooltip id={'EPAFeedbackWordCount'} className='custom-react-tooltip' />

                    </h3>
                    <div className='chart-container'>
                        <BarChart width={width / 2} height={300}
                            data={custom_data}
                            layout="vertical"
                            barGap={0}
                            barCategoryGap={'20%'}
                            margin={{ left: 25, right: 30, top: 10, bottom: 10 }}>
                            <XAxis style={{ fill: 'black', 'fontWeight': 'bolder' }}
                                type="number" />
                            <YAxis style={{ 'fontWeight': 'bold' }}
                                width={105} tickSize={0} tickMargin={5}
                                type="category" axisLine={false} dataKey="year" />
                            <Tooltip labelStyle={{ 'color': 'black' }}
                                wrapperStyle={{ 'fontWeight': 'bold' }} />
                            <Bar dataKey={t("Average Words Per Comment")} fill="#43b98e" />
                        </BarChart>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ProgramAllYearSummary);

