import React, { Component } from 'react';
import ReactTable from 'react-table';
import { customFilter } from '../../utils/genericUtility';
import { NumberToEPAText } from "../../utils/convertEPA";
import ReactTooltip from 'react-tooltip';
import downloadCSV from '../../utils/downloadCSV';
import moment from 'moment';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
class FacultyExpiredRecordTable extends Component {
    constructor(props) {
        super(props);
    }

    downloadReport = () => {

        const { currentFacultyRecords = [], t } = this.props;

        if (currentFacultyRecords[0] && currentFacultyRecords[0].expiredRecords) {
            downloadCSV(['Encounter Date', 'Expiry Date', 'Learner', 'EPA', 'Rating', 'Feedback']
                , _.map(currentFacultyRecords[0].expiredRecords, e =>
                ([e['Date'] || '',
                moment(e.Expiry_Date, 'MMM DD, YYYY').format('YYYY-MM-DD'),
                e['Resident_Name'] || '',
                NumberToEPAText(String(e['EPA'])),
                e['Rating'] || '',
                e['Feedback'] || ''])),
                'expired-epa-report');
        }
    }

    render() {

        const { currentFacultyRecords = [], currentFaculty, width, t } = this.props;

        let innerRecords = [];

        // if there are no records available or
        //  if the faculty is set to all then dont show anything
        if (currentFaculty == 'ALL' || currentFacultyRecords.length == 0) {
            return null;
        }

        else {
            // In the table show only records that have not been expired
            innerRecords = currentFacultyRecords[0].expiredRecords || [];
        }

        const columns = [{
            Header: t('Date'),
            accessor: 'Date',
            maxWidth: 100,
            className: 'text-center',
            filterMethod: customFilter
        },
        {
            Header: t('Expiry Date'),
            accessor: 'Expiry_Date',
            maxWidth: 100,
            className: 'text-center',
            filterMethod: customFilter
        },
        {
            Header: t('Learner'),
            accessor: 'Resident_Name',
            maxWidth: 200,
            className: 'text-center',
            filterMethod: customFilter
        },
        {
            Header: t('EPA'),
            accessor: 'EPA',
            maxWidth: 50,
            className: 'epa-cell text-center',
            filterMethod: customFilter
        },
        {
            Header: t('Rating'),
            accessor: 'Rating',
            maxWidth: 60,
            className: 'text-center',
            filterMethod: customFilter
        },
        {
            Header: t('Feedback'),
            accessor: 'Feedback',
            className: 'feedback-cell',
            filterMethod: customFilter
        }];

        return <div className='table-box m-t-lg no-printing' style={{ width: width }}>
            {currentFacultyRecords.length > 0 &&
                [<h3 key='faculty-table-title'>
                    {t("Summary of Expired EPAs by")} <span className='text-capitalize'>{" " + currentFaculty} </span>
                    <i data-for={'faculty-table-infotip'} data-tip={t("facultyDevlopment-summaryOfEPAsByExpiredFacultyName")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    <button onClick={this.downloadReport} className='m-l btn btn btn-primary-outline'> <i className="fa fa-download"></i>{" " + t("Download")}</button>
                </h3>,
                <ReactTable
                    key='faculty-table'
                    data={(_.map(innerRecords, (d) => ({ ...d, 'Expiry_Date': moment(d.Expiry_Date, 'MMM DD, YYYY').format('YYYY-MM-DD'), 'EPA': NumberToEPAText(String(d.EPA)) })))}
                    columns={columns}
                    defaultPageSize={5}
                    resizable={false}
                    filterable={true}
                    previousText={t('Previous')}
                    nextText={t('Next')}
                    defaultSorted={[{ id: "observation_date", desc: true }]} />]}
            <ReactTooltip id={'faculty-table-infotip'} className='custom-react-tooltip' />
        </div>

    }
}

export default withTranslation()(FacultyExpiredRecordTable);