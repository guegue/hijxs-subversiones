<template>

    <b-container  :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">
        <b-row class="text-white justify-content-center">
            <b-col sm="2" md="2" lg="2" v-for="option in optionsMenu" :key="option.positionOption" class="p-0">
                <b-link router-tag="a" to="/" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':(parseInt(option.positionOption) === 1)}"></b-dropdown-divider>
                    <small>{{option.name}}</small>
                </b-link>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>
    export default {
        name: 'TopBar',
        props: {
            flag: Boolean
        },
        data: () => {
            return {
                optionsMenu: [
                    {
                        positionOption: '01',
                        name: 'INICIO'
                    },
                    {
                        positionOption: '02',
                        name: 'EXHIBICIÓN PRINCIPAL'
                    },
                    {
                        positionOption: '03',
                        name: 'COLECCIONES'
                    },
                    {
                        positionOption: '04',
                        name: 'BLOG'
                    },
                    {
                        positionOption: '05',
                        name: 'VIDEOS'
                    }

                ]
            }
        }
    }
</script>


<style scoped>
    .topbar {
        z-index: 2;
        top: 35px;
        left: 15%;
        /*margin-left: 150px !important;*/
    }

    .row div {
        width: 170px;
    }

    .divider-line-2 {
        border: 2px solid #fff;
        width: 100%;
    }

    .dropdown-divider.active {
        border: 2px solid #6aae40;
    }

    .text-no-decoration {
        text-decoration: none;
    }
</style>