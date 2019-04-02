import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

class ExpiredResidentData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    toggleVisibility(event) {
        event.preventDefault();
        this.setState({ isVisible: !this.state.isVisible });
    }

    render() {
        let columns = [{
            Header: 'Expired Date',
            accessor: 'Date',
            filterMethod: customFilter
        }, {
            Header: 'EPA',
            accessor: 'EPA',
            filterMethod: customFilter
        },
        {
            Header: 'Observer Name',
            accessor: 'Observer_Name',
            className: 'text-left',
            filterMethod: customFilter
        }],
            { width, expiredResidentData = [] } = this.props;

        console.log(expiredResidentData);

        return (
            <div className='expired-box' >
                {expiredResidentData.length > 0 &&
                    <div>
                        <h4 onClick={this.toggleVisibility} className="text-left">
                            {this.state.isVisible ? <span className="icon icon-chevron-down"></span> : ''}
                            EXPIRED EPA COUNT {expiredResidentData.length} , Most recent EPA expired on {expiredResidentData[0].Date} {this.state.isVisible ? '' : ', Click to view more...'}
                        </h4>
                        <div className={'table-box ' + (this.state.isVisible ? '' : 'hidden-table-box')}>
                            <ReactTable
                                data={expiredResidentData}
                                columns={columns}
                                defaultPageSize={5}
                                resizable={false}
                                filterable={true}
                                className='-highlight'
                                defaultSorted={[{ id: "Date", desc: true }]} />
                        </div>
                    </div>
                }
            </div>)
    }
}


function customFilter(filter, rows) {
    rows[filter.id] = rows[filter.id] || '';
    filter.value = filter.value || '';
    return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
}

function mapStateToProps(state) {
    return {
        expiredResidentData: _.reverse(_.sortBy(state.oracle.expiredResidentData, (d) => d.Date))
    };
}

export default connect(mapStateToProps, null)(ExpiredResidentData);

