<template>
    <div class="row p-1">
        <h1>Hello Shopmanagement</h1>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2 mt-2">
            <button class="btn btn-success" v-on:click="getShops">
                Refresh
            </button>
            <button class="btn btn-success" v-on:click="getConsole">
                Console
            </button>
            <p>{{ this.rowData }}</p>
        </div>
    </div>
</template>

<script>
import ShopService from '../../../db/ShopService'
export default {
    data () {
        return {
            rowData: [],
            shopService: new ShopService()
        }
    },
    created () {
        this.getConsole()
        this.getShops()
    },
    methods: {
        getShops () {
            this.shopService.getShops().then(successResponse => {
                this.rowData = successResponse
            })
        },
        getConsole () {
            console.log(this.rowData)
        }
    }
}
</script> 