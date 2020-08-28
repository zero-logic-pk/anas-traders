import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

import ShopService from '../db/ShopService';
import Routes from './Routes';

class ShopManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {
                    headerName: 'Shop Name',
                    field: 'name',
                    editable: true,
                    sortable: true,
                    filter: true
                },
                {
                    headerName: 'Address',
                    field: 'address',
                    editable: true,
                    sortable: true,
                    filter: true
                }
            ],
            rowData: [],
            shopService: new ShopService()
        };
    }

    componentWillMount() {
        this.getShops();
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnsApi = params.columnsApi;
    };

    onRowValueChanged = event => {
        const fn = event.data.id
            ? this.state.shopService.updateShop
            : this.state.shopService.addShop;
        fn({ ...event.data }).then(
            () => {},
            error => {
                console.error({ error });
                this.getShops();
            }
        );
    };

    onAddShopClick = () => {
        this.setState({
            rowData: [{ id: '', name: '', address: '' }, ...this.state.rowData]
        });
    };

    onRemoveSelectedRows = () => {
        const selectedData = this.gridApi.getSelectedRows();
        if (selectedData.length === 0) return;

        this.state.shopService
            .removeShops(selectedData.map(m => m.id))
            .then(
                () => {},
                error => console.error(error)
            )
            .finally(this.getShops);
    };

    getShops = () => {
        this.state.shopService.getShops().then(successResponse => {
            this.setState({ rowData: successResponse });
        });
    };

    render() {
        return (
            <div className="row p-1">
                <Routes/>
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2 mt-2">
                    <button className="btn btn-success" onClick={this.getShops}>
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary ml-1"
                        onClick={this.onAddShopClick}>
                        Add Shop
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

export default ShopManagement;
