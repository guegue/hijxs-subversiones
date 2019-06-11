<template>
    <b-row class="pt-4">
        <div class="" style="width:67%;">
            <b-breadcrumb :items="items"></b-breadcrumb>
            <!-- <button type="button" class="btn btn-lg btn-style btn-color" @click="searchByInput()">
               <span style="color:#65b32e !important;  stroke: white; stroke-width: 40;" class="fa fa-filter">
               </span> FILTRAR
             </button>-->
        </div>
        <div style="width:23%; margin-left:3%;">
            <div class="input-group h-75">
                <input type="text" class="form-control h-100" v-model="search"
                       v-on:keyup.enter="searchByInput()" placeholder="Search this">
                <div class="input-group-append h-100">
                    <button class="btn btn-filtrar pr-4 pl-4 " style="font-size: 1.7em !important;"
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
        },
        data: () => {
            return {
                search: null,
                items: [
                    {
                        text: 'Inicio',
                        href: '/'
                    },
                    {
                        text: 'Testimonios',
                        active: true
                    }
                ]
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

</style>
