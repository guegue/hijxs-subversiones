<template>

    <b-container :class="[{'position-absolute':flag,'topbar':flag}]" :fluid="!flag">
        <b-row class="text-white justify-content-center">
            <b-col sm="2" md="2" lg="2" v-for="option in optionsMenu" :key="option.positionOption" class="p-0">
                <a :href="'#'+option.section" class="text-left text-no-decoration text-white">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':(parseInt(option.positionOption)===indexMenu)}"></b-dropdown-divider>
                    <small>{{option.name}}</small>
                </a>
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
                        section: 'idSlider'
                    },
                    {
                        positionOption: '02',
                        name: 'EXHIBICIÓN PRINCIPAL',
                        section: 'down-section'
                    },
                    {
                        positionOption: '03',
                        name: 'COLECCIONES',
                        section: ''
                    },
                    {
                        positionOption: '04',
                        name: 'BLOG',
                        section: ''
                    },
                    {
                        positionOption: '05',
                        name: 'VIDEOS',
                        section: 'videos'
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
