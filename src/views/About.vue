<template>
    <div class="row p-1">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2 mt-2">
            <button class="btn btn-success" :Click={getShops}>
                Refresh
            </button>
            <button
                class="btn btn-primary ml-1"
                :Click={onAddShopClick}>
                Add Shop
            </button>
            <button
                class="btn btn-danger ml-1"
                :Click={onRemoveSelectedRows}>
                Remove Selected
            </button>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div
                class="ag-theme-blue"
                :style="{
                    height: 240 + 'px',
                    width: 100 + '%'
                }">
                <AgGridVue
                    :columnDefs="this.state.columnDefs"
                    :rowData="this.state.rowData"
                    :rowSelection="'multiple'"
                    :animateRows="true"
                    :debug="true"
                    :editType="'fullRow'"
                    :onGridReady="this.onGridReady"
                    :onRowValueChanged="
                        this.onRowValueChanged
                    "></AgGridVue>
            </div>
        </div>
    </div>
</template>

<script>
import ShopService from '../db/ShopService'
import AgGridVue from 'ag-grid-vue'
export default {
    data () {
        return {
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
        }
    },
    created () {
        this.getShops();
    },
    methods: {
        onGridReady: params => {
            this.gridApi = params.api
            this.gridColumnsApi = params.columnsApi
        },
        onRowValueChanged: event => {
            const fn = event.data.id
                ? this.state.shopService.updateShop
                : this.state.shopService.addShop;
            fn({ ...event.data }).then(
                () => {},
                error => {
                    console.error({ error })
                    this.getShops();
                }
            )
        },
        onAddShopClick: () => {
            this.setState({
                rowData: [{ id: '', name: '', address: '' }, ...this.state.rowData]
            })
        },
        onRemoveSelectedRows: () => {
            const selectedData = this.gridApi.getSelectedRows()
            if (selectedData.length === 0) return

            this.state.shopService
                .removeShops(selectedData.map(m => m.id))
                .then(
                    () => {},
                    error => console.error(error)
                )
                .finally(this.getShops)
        },
        getShops: () => {
            this.state.shopService.getShops().then(successResponse => {
                this.setState({ rowData: successResponse })
            })
        }
    }
}
</script>

<style scoped>

</style>