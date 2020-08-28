import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

import AgentService from '../db/AgentService';
import Routes from './Routes';

class AgentManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {
                    headerName: 'Agent Name',
                    field: 'name',
                    editable: true,
                    sortable: true,
                    filter: true
                }
            ],
            rowData: [],
            agentService: new AgentService()
        };
    }

    componentWillMount() {
        this.getAgents();
    }

    onGridReady = params => {
        this.gridApi = params.api;
    };

    onRowValueChanged = event => {
        const fn = event.data.id
            ? this.state.agentService.update
            : this.state.agentService.add;
        fn({ ...event.data }).then(
            () => {},
            error => {
                console.error({ error });
                this.getAgents();
            }
        );
    };

    onAddAgentClick = () => {
        this.setState({
            rowData: [{ id: '', name: '' }, ...this.state.rowData]
        });
    };

    onRemoveSelectedRows = () => {
        const selectedData = this.gridApi.getSelectedRows();
        if (selectedData.length === 0) return;

        this.state.agentService
            .delete(selectedData.map(m => m.id))
            .then(
                () => {},
                error => console.error(error)
            )
            .finally(this.getAgents);
    };

    getAgents = () => {
        this.state.agentService.getAll().then(successResponse => {
            this.setState({ rowData: successResponse });
        });
    };

    render() {
        return (
            <div className="row p-1">
                <Routes/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2 mt-2">
                    <button
                        className="btn btn-success"
                        onClick={this.getAgents}>
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary ml-1"
                        onClick={this.onAddAgentClick}>
                        Add Agent
                    </button>
                    <button
                        className="btn btn-danger ml-1"
                        onClick={this.onRemoveSelectedRows}>
                        Remove Selected
                    </button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div
                        className="ag-theme-blue"
                        style={{
                            height: '240px',
                            width: '100%'
                        }}>
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            rowSelection="multiple"
                            animateRows={true}
                            editType="fullRow"
                            onGridReady={this.onGridReady}
                            onRowValueChanged={
                                this.onRowValueChanged
                            }></AgGridReact>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgentManagement;
