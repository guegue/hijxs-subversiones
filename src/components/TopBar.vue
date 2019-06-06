<template>
    <b-container :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">
        <b-row class="text-white justify-content-center">
            <b-col sm="2" md="2" lg="2" v-for="option in optionsMenu" :key="option.positionOption" class="p-0">
                <b-link router-tag="a" :to="'/'+option.url" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':(parseInt(option.positionOption)===indexMenu)}"></b-dropdown-divider>
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
            flag: Boolean,
            indexMenu: null,
        },
        data: () => {
            return {
                optionsMenu: [
                    {
                        positionOption: '01',
                        name: 'INICIO',
                        url: ''
                    },
                    {
                        positionOption: '02',
                        name: 'EXHIBICIÓN PRINCIPAL',
                        url: ''
                    },
                    {
                        positionOption: '03',
                        name: 'COLECCIONES',
                        url: ''
                    },
                    {
                        positionOption: '04',
                        name: 'BLOG',
                        url: ''
                    },
                    {
                        positionOption: '05',
                        name: 'VIDEOS',
                        url: 'videos'
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
