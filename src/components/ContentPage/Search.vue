<template>
    <b-row class="pt-4">
        <div class="" style="width:64%;margin-left:3%;">
            <b-breadcrumb v-if="hasDescription" :items="currentBreadCrumb"></b-breadcrumb>
        </div>
        <div style="width:26%; margin-left:3%;">
            <div class="input-group h-75">
                <input type="text" class="form-control h-100" v-model="search"
                       v-on:keyup.enter="searchByInput()" placeholder="Search this">
                <div class="input-group-append h-100">
                    <button class="btn btn-filtrar pr-4 pl-4 pb-2" style="font-size: 1.7em !important;"
                            type="button" @click="searchByInput()">
                        <i class="fa fa-search"> </i>
                    </button>
                </div>
            </div>
        </div>
    </b-row>
</template>

<script>
    export default {
        name: 'Search',
        props: {
            callMethod: Function,
            currentBreadCrumb:Array
        },
        data: () => {
            return {
                search: null,
                hasDescription:false
            }
        },
        methods: {
            searchByInput() {
                // this.$eventBus.$emit('auxItemsPageComp',this.auxItemsPage.length === 0 ?this.itemsPage : this.auxItemsPage);
                this.callMethod(this.search);
            }
        }
    }
</script>

<style scoped>

    .btn-filtrar {
        background-color: white;
        border: 1px solid #ced4da;
        border-left: 1px solid white;
    }
    .svg-inline--fa {vertical-align: text-top !important;}

</style>
