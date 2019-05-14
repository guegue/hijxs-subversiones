<template>
    <div>
        <!--setting timeline-->
        <div class="setting-square pt-2 setting-square-button" @click="toggleSettingSidebar">
            <div class="text-center text-white">
                <i class="fas fa-cog fa-2x"></i>
            </div>
        </div>

        <div class="sidebar-setting-square collapsed">
            <b-container>
                <b-row>
                    <b-col>
                        <span class="float-right mt-2 setting-square-close" @click="toggleSettingSidebar"><i
                                class="fas fa-cog fa-2x"></i>
                        </span>
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
        position: absolute;
        height: 50px;
        width: 70px;
        bottom: 10px;
        right: 0;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #65B32E;
        border: none;
        cursor: pointer;
    }

    .sidebar-setting-square {
        height: 100%;
        overflow: auto;
    }

    .sidebar-setting-square {
        position: absolute;
        right: 0;
        top: 92%;
        z-index: 1;
        background: white;
        width: 30%;
        -webkit-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        box-shadow: 0 0 12px -1px rgba(0, 0, 0, 0.75);
        transition: width .35s;
        height: 40%;
        border-radius: 4px 0 0 4px;
    }

    .sidebar-setting-square.collapsed {
        width: 0;
    }

    .setting-square-close {
        cursor: pointer;
    }
</style>