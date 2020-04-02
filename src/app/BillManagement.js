import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

import BillService from '../db/BillService';
import AgentService from '../db/AgentService';
import ShopService from '../db/ShopService';
import AddEditBillModal from './AddEditBillModal';
import swal from 'sweetalert';
import BillPaymentModal from './BillPaymentModal';

export default class BillManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultColDef: {
                resizable: true,
                editable: false,
                sortable: true,
                filter: true
            },
            columnDefs: [
                {
                    headerName: 'Shop Name',
                    field: 'shopName'
                },
                {
                    headerName: 'Agent Name',
                    field: 'agentName'
                },
                {
                    headerName: 'Bill Amount',
                    field: 'amount'
                },
                {
                    headerName: 'Received Amount',
                    field: 'paidAmount'
                },
                {
                    headerName: 'Remaining Amount',
                    field: 'remainingAmount',
                    valueGetter: params =>
                        params.data.amount - (params.data.paidAmount || 0)
                },
                {
                    headerName: 'Created On',
                    field: 'createdOn'
                },
                {
                    headerName: 'Due On',
                    field: 'dueOn'
                }
            ],
            rowData: [],
            addEditBillModal: {
                id: 0,
                shopId: '',
                shopName: '',
                agentId: '',
                agentName: '',
                amount: 0.0,
                createdOn: '',
                dueOn: ''
            },
            isAddEditModalOpen: false,
            isBillPaymentModalOpen: false,
            billId: 0,
            shops: [{ id: 0, name: '' }],
            agents: [{ id: 0, name: '' }],
            billService: new BillService(),
            shopService: new ShopService(),
            agentService: new AgentService()
        };
    }

    componentDidMount() {
        this.getAllBills();
        Promise.all([
            this.state.shopService.getShops(),
            this.state.agentService.getAll()
        ]).then(
            successResponses => {
                this.setState({
                    shops: successResponses[0],
                    agents: successResponses[1]
                });
            },
            errorResponse => console.error(errorResponse)
        );
    }

    onGridReady = params => {
        this.gridApi = params.api;
    };

    onAddBillClick = () => {
        this.state.addEditBillModal = {
            id: 0,
            shopId: '',
            shopName: '',
            agentId: '',
            agentName: '',
            amount: 0.0,
            createdOn: '',
            dueOn: ''
        };
        this.toggleAddEditModal();
    };

    onAddBillPaymentClick = () => {
        const selectedData = this.gridApi.getSelectedRows();
        if (selectedData.length === 0) {
            swal({
                title: 'Select bill',
                text: 'Select a bill row to add its payment.',
                icon: 'info'
            });
            return;
        } else if (selectedData.length > 1) {
            swal({
                title: 'Multiple bill selected.',
                text: 'Select only one bill row to add its payment.',
                icon: 'info'
            });
            return;
        }

        this.setState({
            billId: selectedData[0].id,
            isBillPaymentModalOpen: true
        });
    };

    onRowDoubleClicked = params => {
        this.setState({
            addEditBillModal: { ...params.data },
            isAddEditModalOpen: true
        });
    };

    onRemoveSelectedRows = () => {
        const selectedData = this.gridApi.getSelectedRows();
        if (selectedData.length === 0) return;

        this.state.billService
            .delete(selectedData.map(m => m.id))
            .then(
                () => {
                    swal({
                        title: 'Success',
                        text: 'Selected bills removed.',
                        icon: 'success'
                    });
                },
                error => {
                    swal({
                        title: 'Erorr',
                        text: 'An erorr occurred while removing bills.',
                        icon: 'error'
                    });
                    console.error(error);
                }
            )
            .finally(this.getAllBills);
    };

    toggleAddEditModal = () => {
        this.getAllBills();
        this.setState(previousState => {
            return {
                isAddEditModalOpen: !previousState.isAddEditModalOpen
            };
        });
    };

    closeBillPaymentModal = () => {
        this.setState(
            {
                isBillPaymentModalOpen: false
            },
            this.getAllBills
        );
    };

    getAllBills = () => {
        this.state.billService.getAll().then(
            successResponse => this.setState({ rowData: successResponse }),
            errorResponse => console.error(errorResponse)
        );
    };

    render() {
        return (
            <div className="row p-1">
                <AddEditBillModal
                    className="primary"
                    isOpen={this.state.isAddEditModalOpen}
                    bill={this.state.addEditBillModal}
                    modalCloseCallback={this.toggleAddEditModal}
                />

                <BillPaymentModal
                    className="primary"
                    isOpen={this.state.isBillPaymentModalOpen}
                    billId={this.state.billId}
                    modalCloseCallback={this.closeBillPaymentModal}
                />

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2 mt-2">
                    <button
                        className="btn btn-success"
                        onClick={this.getAllBills}>
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary ml-1"
                        onClick={this.onAddBillClick}>
                        Add Bill
                    </button>
                    <button
                        className="btn btn-primary ml-1"
                        onClick={this.onAddBillPaymentClick}>
                        Add Payment
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
                            defaultColDef={this.state.defaultColDef}
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            onRowDoubleClicked={this.onRowDoubleClicked}
                            rowSelection="multiple"
                            animateRows={true}
                            stopEditingWhenGridLosesFocus={true}
                            editType="fullRow"
                            onGridReady={this.onGridReady}></AgGridReact>
                    </div>
                </div>
            </div>
        );
    }
}
