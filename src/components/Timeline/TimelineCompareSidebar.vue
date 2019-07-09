<template>
    <div>
        <span class="compare-square text-white float-right" @click="toggleCompareSidebar"><i class="fas fa-sliders-h fa-lg"></i></span>

        <div class="sidebar-compare-timeline collapsed">
            <b-container class="mb-3">
                <b-row>
                    <b-col>
                        <span class="float-right mt-1 mr-2 sidebar-compare-timeline-close" @click="toggleCompareSidebar"><i
                                class="fas fa-sliders-h fa-lg"></i>
                        </span>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            toggleCompareSidebar() {
                document.querySelector(".sidebar-compare-timeline").classList.toggle("collapsed");
            }
        },
    }
</script>

<style scoped>
    .compare-square {
        padding: 5px 10px 5px 10px;
        right: 0;
        border-radius: 5px;

        background-color: #65B32E;
        border: none;
        cursor: pointer;
    }

    .sidebar-compare-timeline {
        overflow: hidden;
    }

    .sidebar-compare-timeline {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        background: white;
        width: 41%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        min-height: 320px;
        border-radius: 4px 0 0 4px;
    }

    .sidebar-compare-timeline.collapsed {
        width: 0;
    }

    .sidebar-compare-timeline-close {
        cursor: pointer;
        color: #65B32E;
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