import React, { Component } from 'react';
import ReactTable from 'react-table';
import { customFilter } from '../../utils/genericUtility';
import ReactTooltip from 'react-tooltip';
import downloadCSV from '../../utils/downloadCSV';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
class FacultyRecordTable extends Component {

    constructor(props) {
        super(props);
    }

    downloadReport = () => {

        const { currentFacultyRecords = [], t } = this.props;

        if (currentFacultyRecords[0] && currentFacultyRecords[0].records) {
            downloadCSV(['Encounter Date', 'Learner', 'EPA', 'Rating', 'Feedback']
                , _.map(currentFacultyRecords[0].records, e =>
                ([e['Date'] || '',
                e['Resident_Name'] || '',
                String(e['EPA']),
                e['Rating'] || '',
                e['Feedback'] || ''])),
                'epa-summary-report');
        }
    }

    render() {

        const { currentFacultyRecords = [], currentFaculty, width, t } = this.props;
        let innerRecords = [];

        const columns = [{
            Header: t('Date'),
            accessor: 'Date',
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

        // if there are no records available or
        //  if the faculty is set to all then dont show anything
        if (currentFaculty == 'ALL' || currentFacultyRecords.length == 0) {
            return null;
        }

        else {
            // In the table show only records that have not been expired
            innerRecords = currentFacultyRecords[0].records || [];
        }

        return <div className='table-box no-printing' style={{ width: width }}>
            {currentFacultyRecords.length > 0 &&
                [<h3 key='faculty-table-title'>
                    {t("Summary of EPAs by ")} <span className='text-capitalize'>{currentFaculty} </span>
                    <i data-for={'faculty-table-infotip'} data-tip={t("facultyDevlopment-summaryOfEPAsByFacultyName")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    <button onClick={this.downloadReport} className='m-l btn btn btn-primary-outline'> <i className="fa fa-download"></i>{" " + t("Download")}</button>
                </h3>,
                <ReactTable
                    key='faculty-table'
                    data={innerRecords}
                    columns={columns}
                    defaultPageSize={10}
                    resizable={false}
                    filterable={true}
                    previousText={t('Previous')}
                    nextText={t('Next')}
                    defaultSorted={[{ id: "observation_date", desc: true }]} />]}
            <ReactTooltip id={'faculty-table-infotip'} className='custom-react-tooltip' />
        </div>

    }

}

export default withTranslation()(FacultyRecordTable);