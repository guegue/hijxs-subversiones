<template>
    <div>
        <!--search input timeline-->
        <div class="search-square pt-2" @click="toggleSearchSidebar">
            <div class="text-center text-white">
                <i class="fas fa-search fa-2x"></i>
            </div>
        </div>

        <div class="sidebar-search collapsed">
            <b-container>
                <b-row>
                    <b-col class="mt-3 d-inline-block" cols="1">
                        <span><i class="fas fa-search"></i></span>
                    </b-col>
                    <b-col class="mt-2 d-inline-block" cols="11">
                        <b-form-input placeholder="Buscar" @keyup.esc="toggleSearchSidebar" @keyup="search"></b-form-input>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>

    import timelineMixin from '../../mixins/timelineMixin';

    export default {
        name: "TimelineSearchSidebar",
        mixins: [
            timelineMixin
        ],
        methods: {
            toggleSearchSidebar() {
                document.querySelector(".sidebar-search").classList.toggle("collapsed");
            },
            search(event){
                this.$root.$emit('search', event.currentTarget.value);
            }
        },
    }
</script>

<style scoped>

    .search-square {
        display: block;
        position: absolute;
        height: 50px;
        width: 70px;
        bottom: 90px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
        -webkit-transition: width 1s; /* For Safari 3.1 to 6.0 */
        transition: width 1s;
        cursor: pointer;
    }

    .sidebar-search {
        height: 100%;
        overflow: auto;
    }

    .sidebar-search {
        position: absolute;
        right: 0;
        top: 81%;
        z-index: 1;
        background: white;
        width: 30%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        height: 7%;
        border-radius: 4px 0 0 4px;
    }

    .sidebar-search.collapsed {
        width: 0;
    }

</style>