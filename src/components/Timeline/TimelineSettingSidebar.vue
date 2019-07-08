<template>
    <div>
        <span class="setting-square text-white float-right" @click="toggleSettingSidebar"><i class="fas fa-filter fa-lg"></i></span>
        <!--setting timeline-->
        <!--<div class="setting-square pt-2 setting-square-button float-right" @click="toggleSettingSidebar">
            <div class="text-center text-white">
                <i class="fas fa-cog fa-2x"></i>
            </div>
        </div>-->

        <div class="sidebar-setting-square collapsed">
            <b-container>
                <b-row>
                    <b-col>
                        <span class="float-right mt-1 mr-2 setting-square-close" @click="toggleSettingSidebar"><i
                                class="fas fa-filter fa-lg"></i>
                        </span>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="mt-2 mb-5">
                        <div class="search-container">
                            <input class="search-input" type="text" placeholder="Buscar">
                            <span class="search-icon"><i class="fas fa-search"></i> </span>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimelineSettingSidebar",
        methods: {
            toggleSettingSidebar() {
                document.querySelector(".sidebar-setting-square").classList.toggle("collapsed");
            }
        }
    }
</script>

<style scoped>
    .setting-square {
        padding: 5px 10px 5px 10px;
        right: 0;
        border-radius: 5px;

        background-color: #65B32E;
        border: none;
        cursor: pointer;
    }

    .sidebar-setting-square {
        overflow: hidden;
    }

    .sidebar-setting-square {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        background: white;
        width: 30%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        height: auto;
        border-radius: 4px 0 0 4px;
    }

    .sidebar-setting-square.collapsed {
        width: 0;
    }

    .setting-square-close {
        cursor: pointer;
    }

    .search-input {
        color: #359be0;
        width: 85%;
        border: none;
        padding: 0 5px;
        border-bottom: 2px solid #359be0;
    }

    .search-input:focus, .search-input:active {
        outline: none;
    }

    .search-input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #a5c8f1;
    }
    .search-input::-moz-placeholder { /* Firefox 19+ */
        color: #a5c8f1;
    }
    .search-input:-ms-input-placeholder { /* IE 10+ */
        color: #a5c8f1;
    }
    .search-input:-moz-placeholder { /* Firefox 18- */
        color: #a5c8f1;
    }

    .search-icon {
        color: #359be0;
    }

</style>