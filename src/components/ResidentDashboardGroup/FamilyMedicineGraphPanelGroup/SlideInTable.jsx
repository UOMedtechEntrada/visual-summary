import React from 'react';
import ReactTable from 'react-table';
import { customFilter } from '../../../utils/genericUtility';

const columns = [{
    Header: 'Date',
    accessor: 'Date',
    maxWidth: 125,
    filterMethod: customFilter
}, {
    Header: 'Supervisory Level',
    accessor: 'Rating_Text',
    maxWidth: 225,
    className: 'text-left',
    filterMethod: customFilter
},
{
    Header: 'Assessor Name',
    accessor: 'Assessor_Name',
    maxWidth: 150,
    className: 'text-left',
    filterMethod: customFilter
},
{
    Header: 'Situation Context',
    accessor: 'Situation_Context',
    className: 'text-left situation-cell',
    maxWidth: 325,
    filterMethod: customFilter
},
{
    Header: 'Comments',
    accessor: 'Feedback',
    className: 'feedback-cell',
    filterMethod: customFilter
}];

// push the table to the left from its inner position and then add 35 pixels which is original margin to the left 
export default (props) => {
    return (
        <div className='table-box m-t' style={{ width: props.width }}>
            <ReactTable
                data={props.data}
                columns={columns}
                defaultPageSize={10}
                resizable={false}
                filterable={true}
                className='-highlight'
                defaultSorted={[{ id: "Date", desc: true }]} />
        </div>)
}
