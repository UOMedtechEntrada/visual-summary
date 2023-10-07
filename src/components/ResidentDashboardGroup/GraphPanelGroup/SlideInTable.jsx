import React from 'react';
import ReactTable from 'react-table';
import { customFilter } from '../../../utils/genericUtility';
import { withTranslation } from "react-i18next";

// push the table to the left from its inner position and then add 35 pixels which is original margin to the left 
export default withTranslation()((props) => {

    const columns = [{
        Header: props.t('Date'),
        accessor: 'Date',
        maxWidth: 150,
        filterMethod: customFilter
    }, {
        Header: props.t('Entrustment Rating'),
        accessor: 'Rating_Text',
        maxWidth: 200,
        className: 'text-left',
        filterMethod: customFilter
    },
    {
        Header: props.t('Assessor Name'),
        accessor: 'Assessor_Name',
        maxWidth: 150,
        className: 'text-left',
        filterMethod: customFilter
    },
    {
        Header: props.t('Situation Context'),
        accessor: 'Situation_Context',
        className: 'text-left situation-cell',
        maxWidth: 250,
        filterMethod: customFilter
    },
    {
        Header: props.t('Comments'),
        accessor: 'Feedback',
        className: 'feedback-cell',
        filterMethod: customFilter
    }];


    return (
        <div className='table-box' style={{ width: (props.width * 4) - 75, 'marginLeft': (-1 * (2 * props.width) + 35) }}>
            <ReactTable
                data={props.data}
                columns={columns}
                defaultPageSize={5}
                resizable={false}
                filterable={true}
                previousText={props.t('Previous')}
                nextText={props.t('Next')}
                className='-highlight'
                defaultSorted={[{ id: "Date", desc: true }]} />
        </div>)
});
